# configuration file for Flask app (keys, database URLs ...)
from dotenv import load_dotenv
from datetime import timedelta 
import os

load_dotenv()

class Config:
  SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
  JWT_SECRET_KEY = os.environ.get('SECRET_KEY')
  JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=5)  # token lifetime
  SQLALCHEMY_TRACK_MODIFICATIONS = False
