import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "default-secret-key")
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(BASE_DIR, 'cafe_fausse.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    ADMIN_KEY = os.getenv("ADMIN_KEY")