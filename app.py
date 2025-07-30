import os
import logging
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix

# Configure logging
logging.basicConfig(level=logging.DEBUG)

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

# Create the app
app = Flask(__name__)

# Configure CORS for API communication with React
CORS(app, origins=["http://localhost:5000", "http://0.0.0.0:5000"], supports_credentials=True)

# Configure JWT
app.config['JWT_SECRET_KEY'] = os.environ.get("SESSION_SECRET", "your-secret-key")
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False  # Tokens don't expire for simplicity
jwt = JWTManager(app)

app.secret_key = os.environ.get("SESSION_SECRET", "your-secret-key")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Configure the database
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///zoorkhan.db")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}

# Initialize the app with the extension
db.init_app(app)

with app.app_context():
    # Import models and routes
    import models
    import auth
    import api_routes
    
    # Create all tables
    db.create_all()
    
    # Create admin user if not exists
    from models import User
    from werkzeug.security import generate_password_hash
    
    admin = User.query.filter_by(email='admin@zoorkhan.com').first()
    if not admin:
        admin_user = User(
            username='admin',
            email='admin@zoorkhan.com',
            password_hash=generate_password_hash('admin123'),
            role='admin',
            full_name='مدیر سیستم'
        )
        db.session.add(admin_user)
        db.session.commit()
        logging.info("Admin user created: admin@zoorkhan.com / admin123")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
