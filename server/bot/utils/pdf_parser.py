from pypdf import PdfReader
import os
from typing import List
import logging

logger = logging.getLogger(__name__)

def extract_text_from_pdf(pdf_path: str) -> str:
    logger.info(f"Starting PDF extraction from: {pdf_path}")
    try:
        if not os.path.exists(pdf_path):
            logger.error(f"PDF file not found: {pdf_path}")
            return ""
            
        reader = PdfReader(pdf_path)
        logger.info(f"PDF loaded successfully, pages: {len(reader.pages)}")
        text = []
        
        for i, page in enumerate(reader.pages):
            try:
                page_text = page.extract_text()
                text.append(page_text)
                logger.info(f"Extracted {len(page_text)} chars from page {i+1}")
            except Exception as e:
                logger.error(f"Error on page {i+1}: {e}")
                continue
                
        final_text = "\n".join(text)
        logger.info(f"Total extracted text length: {len(final_text)}")
        return final_text
    except Exception as e:
        logger.error(f"PDF processing error: {e}", exc_info=True)
        return ""

def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 100) -> List[str]:
    logger.info(f"Chunking text of length {len(text)}")
    words = text.split()
    chunks = []
    current_chunk = []
    current_size = 0
    
    for i, word in enumerate(words):
        current_size += len(word) + 1
        current_chunk.append(word)
        
        if current_size > chunk_size:
            chunks.append(" ".join(current_chunk))
            # Keep last few words for overlap
            overlap_words = current_chunk[-overlap:]
            current_chunk = overlap_words
            current_size = sum(len(w) + 1 for w in overlap_words)
            
    if current_chunk:
        chunks.append(" ".join(current_chunk))
        
    logger.info(f"Created {len(chunks)} chunks")
    return chunks
