# app.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from os import environ
from dotenv import load_dotenv
from models import db

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('dbURL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    # db = SQLAlchemy(app)
    CORS(app)
    return app

app = create_app()
db = SQLAlchemy(app)  # Initialize SQLAlchemy outside of create_app()

if __name__ == "__main__":
    app.run(debug=True)
