from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Question, Answer
import os
import random

basedir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(basedir, 'database.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

print("Using database file:", app.config['SQLALCHEMY_DATABASE_URI'])
print("Absolute DB path:", os.path.abspath(os.path.join(os.path.dirname(__file__), 'database.db')))

db.init_app(app)

@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        print("🔥 Signup data received:", data)

        existing_user = User.query.filter(
            (User.username == data['username']) | (User.email == data['email'])
        ).first()

        if existing_user:
            print("⚠️ User already exists:", existing_user)
            return jsonify({'error': 'User already exists'}), 400

        hashed_pw = generate_password_hash(data['password'])
        avatar_url = f"https://api.dicebear.com/7.x/identicon/svg?seed={data['username']}"
        user = User(
            username=data['username'],
            email=data['email'],
            password=hashed_pw,
            is_admin=data.get('is_admin', False),
            profile_photo=avatar_url
        )
        db.session.add(user)
        db.session.commit()
        print("✅ User created and committed:", user)
        return jsonify({
            'message': 'User created successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_admin': user.is_admin,
                'profile_photo': user.profile_photo
            }
        })
    except Exception as e:
        print("❌ Error in signup:", e)
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Login successful', 'user': {'id': user.id, 'username': user.username, 'email': user.email, 'is_admin': user.is_admin, 'profile_photo': user.profile_photo}})
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    questions = [{'id': q.id, 'title': q.title, 'body': q.body, 'created_at': q.created_at} for q in user.questions]
    answers = [{'id': a.id, 'body': a.body, 'question_id': a.question_id, 'created_at': a.created_at} for a in user.answers]
    return jsonify({'id': user.id, 'username': user.username, 'email': user.email, 'is_admin': user.is_admin, 'profile_photo': user.profile_photo, 'questions': questions, 'answers': answers})

@app.route('/api/health', methods=['GET'])
def health():
    try:
        user_count = User.query.count()
        return jsonify({'status': 'ok', 'user_count': user_count})
    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)}), 500

@app.route('/api/users', methods=['GET'])
def list_users():
    users = User.query.all()
    return jsonify([
        {
            'id': u.id,
            'username': u.username,
            'email': u.email,
            'is_admin': u.is_admin,
            'profile_photo': u.profile_photo
        } for u in users
    ])

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True) 