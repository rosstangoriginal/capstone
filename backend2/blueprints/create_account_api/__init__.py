from flask import Flask, request, jsonify, Blueprint
import mysql.connector

blueprint = Blueprint('create_account_api',__name__, url_prefix='/create_account_api')

# Establish MySQL connection
def connect_to_database():
    db = mysql.connector.connect(
        user="root",
        password="Capstone",
        database="Electric",
        host="127.0.0.1"
    )
    return db

@blueprint.route('/create_account', methods=['POST'])
def create_account():
    data = request.get_json()
   
    firstName = data.get('first_name')
    lastName = data.get('last_name')
    email = data.get('email')
    password = data.get('password')

    db = connect_to_database()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM User WHERE email = %s", (email,))
    existing_user = cursor.fetchone()

    

    if existing_user:
        return jsonify({'error': 'Email already in use'}), 400

    cursor.execute("INSERT INTO User (FirstName, LastName, Email, Password) VALUES (%s, %s, %s, %s)",
                   (firstName, lastName, email, password))
    db.commit()
    cursor.close()
    db.close()


    return jsonify({'message': 'Account created successfully'}), 201

