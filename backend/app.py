# app.py    
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from os import environ
from dotenv import load_dotenv
from models import db

import logging
from logging.handlers import RotatingFileHandler

load_dotenv()

def create_app():
    
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('dbURL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Logging configuration
    log_formatter = logging.Formatter(
        '%(asctime)s %(levelname)s %(module)s %(funcName)s %(message)s')
    log_handler = RotatingFileHandler('app.log', maxBytes=10000000, backupCount=5)
    log_handler.setFormatter(log_formatter)
    app.logger.addHandler(log_handler)
    app.logger.setLevel(logging.INFO)

    db.init_app(app)
    CORS(app)
    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
