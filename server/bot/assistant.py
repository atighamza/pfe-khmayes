import os
import json
import logging
import requests
import tempfile
from openai import OpenAI
from pymongo import MongoClient
from bson.objectid import ObjectId
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from .utils.pdf_parser import extract_text_from_pdf, chunk_text

logger = logging.getLogger(__name__)

class ChatAssistant:
    def __init__(self, api_key):
        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key
        )
        # Initialize MongoDB connection
        mongo_uri = os.getenv('MONGO_URI')
        self.mongo_client = MongoClient(mongo_uri)
        self.db = self.mongo_client.khmayes  # Your database name
        
        # Initialize embeddings model
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        
    def _create_vector_store(self, texts, metadatas):
        logger.info(f"Creating vector store with {len(texts)} texts")
        return Chroma.from_texts(
            texts=texts,
            embedding=self.embeddings,
            metadatas=metadatas
        )
    
    def _get_cv_text(self, cv_path):
        """Get CV text with proper error handling for both local paths and URLs"""
        try:
            # Check if cv_path is a URL
            if cv_path.startswith(('http://', 'https://')):
                logger.info(f"Attempting to download CV from URL: {cv_path}")
                response = requests.get(cv_path, timeout=10)
                response.raise_for_status()
                # Create temporary file for PDF
                with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
                    tmp.write(response.content)
                    tmp_path = tmp.name
                logger.info(f"Downloaded CV to temporary file: {tmp_path}")
                text = extract_text_from_pdf(tmp_path)
                os.unlink(tmp_path)  # Clean up temporary file
            else:
                # Handle local file path
                base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
                full_path = os.path.join(base_path, cv_path.lstrip('/').lstrip('\\'))
                logger.info(f"Attempting to read CV from local path: {full_path}")
                
                if os.path.exists(full_path):
                    logger.info("CV file found, extracting text...")
                    text = extract_text_from_pdf(full_path)
                else:
                    logger.warning(f"CV file not found at path: {full_path}")
                    return ""
            
            logger.info(f"Extracted {len(text)} characters from CV")
            return text
        except Exception as e:
            logger.error(f"Error processing CV at {cv_path}: {e}", exc_info=True)
            return ""
    
    def _get_context(self, user_role, user_id):
        logger.info(f"Getting context for user {user_id} with role {user_role}")
        
        # Get recent chat history
        last_messages = list(self.db.chathistory.aggregate([
            {"$match": {"userId": ObjectId(user_id)}},
            {"$unwind": "$messages"},
            {"$sort": {"messages.timestamp": -1}},
            {"$limit": 3},  # Get last 3 messages
            {"$project": {"message": "$messages"}}
        ]))
        
        recent_context = ""
        if last_messages:
            recent_context = "\n".join([
                f"{msg['message']['role']}: {msg['message']['content']}"
                for msg in last_messages
            ])
            logger.info("Added recent chat context")

        if user_role == "student":
            # Get student's data using PyMongo
            student = self.db.users.find_one({"_id": ObjectId(user_id)})
            logger.info(f"Found student: {student.get('name') if student else 'Not found'}")
            internships = list(self.db.internships.find())
            
            # Extract text from CV
            cv_text = ""
            if student and student.get('resumeUrl'):
                logger.info(f"Found resumeUrl: {student['resumeUrl']}")
                cv_text = self._get_cv_text(student['resumeUrl'])
                logger.info(f"CV text extracted: {bool(cv_text)}")
            
            # Create vectors from CV chunks and internship descriptions
            texts = []
            metadatas = []
            
            if cv_text:
                cv_chunks = chunk_text(cv_text)
                texts.extend(cv_chunks)
                metadatas.extend([{
                    "source": "cv",
                    "chunk_type": "cv_content"
                } for _ in cv_chunks])
                logger.info(f"Added {len(cv_chunks)} CV chunks to vector store")
            
            # Add profile data as additional context
            profile_text = f"""
            Student Profile:
            Name: {student.get('name', '')}
            University: {student.get('university', '')}
            Degree: {student.get('degree', '')}
            Year: {student.get('year', '')}
            """
            texts.append(profile_text)
            metadatas.append({
                "source": "profile",
                "chunk_type": "student_info"
            })
            
            for internship in internships:
                texts.append(json.dumps({
                    "title": internship.get('title'),
                    "description": internship.get('description'),
                    "technologies": internship.get('technologies'),
                    "type": internship.get('type')
                }))
                metadatas.append({"source": "internship"})
            
            # Create vector store and get relevant chunks
            vectorstore = self._create_vector_store(texts, metadatas)
            relevant_chunks = vectorstore.similarity_search(
                "internship requirements and skills",
                k=3
            )
            logger.info(f"Found {len(relevant_chunks)} relevant chunks for student")
            
            context = {
                "student_profile": {
                    "name": student.get('name', ''),
                    "university": student.get('university', ''),
                    "degree": student.get('degree', ''),
                    "year": student.get('year', '')
                },
                "cv_content": cv_text[:500] + "..." if cv_text else "No CV uploaded",
                "relevant_matches": [doc.page_content for doc in relevant_chunks],
                "recent_conversation": recent_context
            }
            
        else:  # company
            logger.info("Processing company context")
            students = list(self.db.users.find({"role": "student"}))
            logger.info(f"Found {len(students)} students")
            company_internships = list(
                self.db.internships.find({"companyId": ObjectId(user_id)})
            )
            logger.info(f"Found {len(company_internships)} company internships")
            
            texts = []
            metadatas = []
            
            # Process all student CVs
            for student in students:
                if student.get('resumeUrl'):
                    logger.info(f"Processing CV for student: {student.get('name')}")
                    cv_text = self._get_cv_text(student['resumeUrl'])
                    if cv_text:
                        cv_chunks = chunk_text(cv_text)
                        texts.extend(cv_chunks)
                        metadatas.extend([{
                            "source": "cv",
                            "student_id": str(student['_id']),
                            "student_name": student.get('name'),
                            "student_degree": student.get('degree'),
                            "student_university": student.get('university')
                        } for _ in cv_chunks])
                        logger.info(f"Added {len(cv_chunks)} CV chunks for student {student.get('name')}")
                    else:
                        logger.warning(f"No CV text extracted for student {student.get('name')}")
            
            for internship in company_internships:
                texts.append(json.dumps({
                    "title": internship.get('title'),
                    "description": internship.get('description'),
                    "technologies": internship.get('technologies'),
                    "type": internship.get('type')
                }))
                metadatas.append({"source": "internship"})
            
            vectorstore = self._create_vector_store(texts, metadatas)
            relevant_chunks = vectorstore.similarity_search(
                "candidate skills and experience",
                k=3
            )
            logger.info(f"Found {len(relevant_chunks)} relevant chunks for company")
            
            # Count CV chunks for debugging
            cv_chunk_count = sum(1 for meta in metadatas if meta.get('source') == 'cv')
            relevant_cv_count = sum(1 for doc in relevant_chunks if doc.metadata.get('source') == 'cv')
            logger.info(f"Total CV chunks: {cv_chunk_count}, Relevant CV chunks: {relevant_cv_count}")
            
            context = {
                "company_internships": [
                    {
                        "title": i.get('title'),
                        "technologies": i.get('technologies')
                    } for i in company_internships
                ],
                "relevant_candidates": [
                    {
                        "content": doc.page_content,
                        "student_name": doc.metadata.get("student_name"),
                        "student_degree": doc.metadata.get("student_degree"),
                        "student_university": doc.metadata.get("student_university")
                    } for doc in relevant_chunks if doc.metadata.get("source") == "cv"
                ],
                "recent_conversation": recent_context
            }
            logger.info("Finished creating context for company")
        
        logger.info("Finished creating context")
        return json.dumps(context)

    def get_response(self, message, user_role, user_id):
        try:
            logger.info(f"Getting response for {user_role} with ID {user_id}")
            context = self._get_context(user_role, user_id)
            context_data = json.loads(context)
            
            # Prepare system prompt based on role
            if user_role == "student":
                system_prompt = f"""You are an AI assistant helping with internships.
                Student Profile: {json.dumps(context_data.get('student_profile', {}))}
                CV Content: {context_data.get('cv_content', 'No CV uploaded')}
                Recent conversation: {context_data.get('recent_conversation', 'No previous context')}
                Available Internships: {context_data.get('relevant_matches', [])}
                
                Respond with specific information from the internships database.
                If asked about CV or profile, use only the student profile and CV content.
                If asked about internships, list matching opportunities from the database."""
            else:
                system_prompt = f"""You are an AI assistant helping with candidate matching.
                Company Internships: {json.dumps(context_data.get('company_internships', []))}
                Recent conversation: {context_data.get('recent_conversation', 'No previous context')}
                Matching Candidates: {json.dumps(context_data.get('relevant_candidates', []))}
                
                Focus on matching candidates to internship requirements.
                Provide specific details about candidates' qualifications.
                If no matching candidates are found, respond with 'No matching candidates found based on current data.'"""
            
            logger.info("Sending request to LLM")
            completion = self.client.chat.completions.create(
                model="moonshotai/kimi-k2:free",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message}
                ],
                extra_headers={
                    "HTTP-Referer": "http://localhost:5000",
                    "X-Title": "Forsa Internships"
                }
            )
            
            response = completion.choices[0].message.content
            if not response or response.isspace():
                logger.error("Received empty response from LLM")
                return "I apologize, but I couldn't generate a proper response. Please try again."
                
            logger.info(f"Generated response of length: {len(response)}")
            return response

        except Exception as e:
            logger.error(f"Error generating response: {str(e)}", exc_info=True)
            return "I encountered an error while processing your request. Please try again."