from flask import Flask, request, jsonify, render_template
from flask_pymongo import PyMongo
import bcrypt
from flask_cors import CORS
app = Flask(__name__)

CORS(app)

# MongoDB
app.config["MONGO_URI"] = "mongodb://mongo:27017/device_db"
mongo = PyMongo(app)
users_collection = mongo.db.users  

@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    if users_collection.find_one({"username": username}):
        return jsonify({"success": False, "message": "Username already exists!"}), 400

    users_collection.insert_one({
        "username": username,
        "password": hashed_password
    })

    return jsonify({"success": True, "message": "User registered successfully!"}), 201

@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = users_collection.find_one({"username": username})
    if not user:
        return jsonify({"success": False, "message": "Invalid username or password!"}), 401

    if bcrypt.checkpw(password.encode('utf-8'), user['password']):
        return jsonify({"success": True, "message": "Login successful!"}), 200
    else:
        return jsonify({"success": False, "message": "Invalid username or password!"}), 401

@app.route('/api/users', methods=['GET'])
def view_users():
    users = list(users_collection.find())  
    for user in users:
        user["_id"] = str(user["_id"])  
        del user['password']
    return jsonify(users)

@app.route('/')
def index():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5003, debug=True)

