from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()
from app.routes.commentRoutes import comment_bp

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes

    if not os.getenv("GROQ_API_KEY"):
        raise ValueError("GROQ_API_KEY not found in environment variables. Please update your .env file.")

    app.register_blueprint(comment_bp, url_prefix='/v1/comments')

    return app