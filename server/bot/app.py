from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from . import bot
import os

# Load environment variables
load_dotenv()

# Verify required environment variables
required_vars = ['JWT_SECRET', 'OPEN_ROUTE_API_KEY']
for var in required_vars:
    if not os.getenv(var):
        raise EnvironmentError(f"Missing required environment variable: {var}")

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config['JWT_SECRET'] = os.getenv('JWT_SECRET')
    
    # Register blueprint
    app.register_blueprint(bot, url_prefix='/bot')
    
    @app.errorhandler(404)
    def not_found(e):
        return {"error": "Not found"}, 404
    
    @app.errorhandler(500)
    def server_error(e):
        return {"error": "Internal server error"}, 500
        
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host='0.0.0.0', port=5100, debug=True)
