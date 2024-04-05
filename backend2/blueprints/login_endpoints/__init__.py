# blueprints/login_endpoints/__init__.py
from flask import Blueprint, jsonify, request
import mysql.connector

blueprint = Blueprint('login_api', __name__, url_prefix='/login_api')

# MySQL configuration
db_config = {
    "host": "127.0.0.1",
    "user": "root",
    "password": "Capstone",
    "database": "Electric"  
}


# Function to check user credentials
def check_credentials(email, password):
    try:
        db = mysql.connector.connect(**db_config)
        cursor = db.cursor()

        query = 'SELECT * FROM User WHERE email =%s AND password =%s'
        cursor.execute(query, (email, password))

        result = cursor.fetchone()

        if result:
            return True
        else:
            return False
    except Exception as e:
        print("Error:", e)
        return False
    finally:
        if db:
            db.close()

def get_user(email):
    try:
        db = mysql.connector.connect(**db_config)
        cursor = db.cursor(dictionary=True)

        # Execute a query to retrieve all users
        query = "SELECT * FROM User WHERE email =%s"
        cursor.execute(query, (email))

        user = cursor.fetchone()

        return jsonify({'firstName': user.FirstName,
                        'lastName': user.LastName,
                        'email': user.Email
        })

    except Exception as e:
        return jsonify({'error': str(e)})
    finally:
        cursor.close()

@blueprint.route('/get_users', methods=['GET'])
def get_users():
    try:
        db = mysql.connector.connect(**db_config)
        cursor = db.cursor(dictionary=True)

        # Execute a query to retrieve all users
        query = "SELECT * FROM User"
        cursor.execute(query)

        users = cursor.fetchall()

        return jsonify({'users': users})

    except Exception as e:
        return jsonify({'error': str(e)})
    finally:
        cursor.close()

@blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password are required."}), 400

    db = mysql.connector.connect(**db_config)
    cursor = db.cursor(dictionary=True)
    query = "SELECT UserID, FirstName, LastName, Email FROM User WHERE email = %s"
    cursor.execute(query, (email,))
    user_data = cursor.fetchone()

    query2 = "SELECT * FROM Energy_Account WHERE UserID = %s"
    cursor.execute(query2, (user_data['UserID'], ))
    energy_account_data = cursor.fetchone()

    query3 = "SELECT * FROM Electricity_Usage WHERE UserID = %s"
    cursor.execute(query3, (user_data['UserID'], ))
    electricity_usage_data = cursor.fetchone()

    print("user_data: ",user_data)
    print("energy_account_data: ", energy_account_data)
    print("electricity_usage_data: ", electricity_usage_data)
    cursor.close()


    if check_credentials(email, password):
        # user_id = user_data['UserID']
        # first_name = user_data['FirstName']
        # last_name = user_data['LastName']
        # email = user_data['Email']
        return jsonify({
            "message": "Login successful.",
            'userId': user_data['UserID'],
            'firstName': user_data['FirstName'],
            'lastName': user_data['LastName'],
            'email': user_data['Email'],
            'energyProvider': energy_account_data['EnergyProvider'],
            'accountNum': energy_account_data['AccountNumber'],
            'address': energy_account_data['Address'],
            'accountName': energy_account_data['AccountName'],
            'phoneNum': energy_account_data['PhoneNumber'],
            'totalOnPeak': electricity_usage_data['Total_On_Peak'],
            'totalOffPeak': electricity_usage_data['Total_Off_Peak'],
            'totalMidPeak': electricity_usage_data['Total_Mid_Peak'],
            'elecFromDate': electricity_usage_data['From_Date'],
            'elecToDate': electricity_usage_data['To_Date']
            }), 200
    else:
        return jsonify({"message": "Login failed. Invalid credentials."}), 401

def login():
    try:

        email = request.get_json().get('email')
        #email = request.args.get('Email')
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        db, cursor = mysql_connect()
        query = "SELECT Email, Password, Salt, UserID, FirstName, LastName FROM User WHERE email = %s"
        cursor.execute(query, (email,))

        user_data = cursor.fetchone()
        cursor.close()

        if user_data:
            password = user_data[1]
            salt = user_data[2]
            userId = user_data[3]
            firstName = user_data[4]
            lastName = user_data[5]
            return jsonify({
                "message": "Login successful.",
                'email': email, 
                'password': password, 
                'salt':salt, 
                'userId':userId,
                'firstName':firstName,
                'lastName':lastName
                }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@blueprint.route('/populate_database', methods=['GET'])
def populate_database():
    try:
        # Dummy data for username and password
        dummy_data = [
            ("John", "Doe", "test@testing.com", 'password'),
            ("Zach", "Fong", "zachf@testing.com",  'password1'),
            ("Tom", "Ford", "tf@testing.com", 'password2')
        ]
        db = mysql.connector.connect(**db_config)
        cursor = db.cursor()

        # Insert dummy data into the User table
        for FirstName, LastName, Email, Password in dummy_data:
            query = "INSERT INTO User (FirstName, LastName, Email, Password) VALUES (%s, %s, %s, %s)"
            cursor.execute(query, (FirstName, LastName, Email, Password))

        db.commit()

        cursor.close()

        return jsonify({'message': 'Database populated with dummy data'})

    except Exception as e:
        return jsonify({'error': str(e)})

# populate_database()