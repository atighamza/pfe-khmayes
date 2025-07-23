from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
from . import bot

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Register blueprint
    app.register_blueprint(bot, url_prefix='/bot')
    
    return app

app = create_app()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5100, debug=True)
