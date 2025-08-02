from flask import request, jsonify
from . import bot
from .assistant import ChatAssistant
import os, sys, jwt
import logging
from bson.objectid import ObjectId
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

sys.path.append("..")

chat_assistant = ChatAssistant(os.getenv('OPEN_ROUTE_API_KEY'))

def get_user_from_token(token):
    try:
        # Remove 'Bearer ' from token
        token = token.replace('Bearer ', '')
        # Decode token
        payload = jwt.decode(token, os.getenv('JWT_SECRET'), algorithms=['HS256'])
        return payload.get('id'), payload.get('role')
    except Exception as e:
        logger.error(f"Error decoding token: {str(e)}", exc_info=True)
        return None, None

@bot.route('/chat/history', methods=['GET'])
def get_chat_history():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'No authorization token'}), 401
            
        user_id, user_role = get_user_from_token(auth_header)
        if not user_id or not user_role:
            return jsonify({'error': 'Invalid token'}), 401

        # Get history with proper sorting
        chat_history = chat_assistant.db.chathistory.aggregate([
            {"$match": {"userId": ObjectId(user_id)}},
            {"$unwind": "$messages"},
            {"$sort": {"messages.timestamp": 1}},  # Sort chronologically
            {"$group": {
                "_id": "$_id",
                "messages": {"$push": {
                    "role": "$messages.role",
                    "content": "$messages.content"
                }}
            }}
        ])
        
        # Handle case where no history exists
        history = next(chat_history, None)
        return jsonify({'history': history.get('messages', []) if history else []})
    except Exception as e:
        logger.error(f"Error fetching chat history: {str(e)}", exc_info=True)
        return jsonify({'history': []}), 500

@bot.route('/chat', methods=['POST'])
def chat():
    try:
        logger.info("Received chat request")
        auth_header = request.headers.get('Authorization')
        logger.info(f"Auth header present: {bool(auth_header)}")
        
        if not auth_header:
            return jsonify({'error': 'No authorization token'}), 401
            
        user_id, user_role = get_user_from_token(auth_header)
        logger.info(f"Decoded token - User ID: {user_id}, Role: {user_role}")
        
        if not user_id or not user_role:
            return jsonify({'error': 'Invalid token'}), 401

        data = request.json
        message = data.get('message')
        if not message or message.isspace():
            return jsonify({'error': 'Empty message'}), 400

        logger.info(f"Processing message: {message[:50]}...")
        response = chat_assistant.get_response(message, user_role, user_id)
        
        if not response or response.isspace():
            return jsonify({'error': 'Empty response from assistant'}), 500

        # Save messages
        now = datetime.now()
        chat_assistant.db.chathistory.update_one(
            {"userId": ObjectId(user_id)},
            {
                "$push": {
                    "messages": {
                        "$each": [
                            {"role": "user", "content": message, "timestamp": now},
                            {"role": "assistant", "content": response, "timestamp": now}
                        ]
                    }
                }
            },
            upsert=True
        )

        logger.info("Successfully generated response")
        return jsonify({'response': response})
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}", exc_info=True)
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500