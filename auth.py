from flask import request, jsonify
from flask_jwt_extended import create_access_token, verify_jwt_in_request, get_jwt_identity
from functools import wraps
from app import app, db
from models import User

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            verify_jwt_in_request()
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            if not user or user.role != 'admin':
                return jsonify({'error': 'دسترسی محدود به مدیران'}), 403
        except Exception as e:
            return jsonify({'error': 'لطفا وارد شوید'}), 401
        return f(*args, **kwargs)
    return decorated_function

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            verify_jwt_in_request()
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            if not user:
                return jsonify({'error': 'کاربر یافت نشد'}), 404
        except Exception as e:
            return jsonify({'error': 'لطفا وارد شوید'}), 401
        return f(*args, **kwargs)
    return decorated_function

def get_current_user():
    try:
        verify_jwt_in_request()
        current_user_id = get_jwt_identity()
        return User.query.get(current_user_id)
    except:
        return None
