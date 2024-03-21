from flask import Flask, Blueprint, request, jsonify
import mysql.connector
import webscrape
import secur
import datetime
from datetime import date
from dateutil.relativedelta import relativedelta


blueprint = Blueprint('energy_account_api', __name__, url_prefix='/energy_account_api')

def connect_to_database():
    db = mysql.connector.connect(
        user="root",
        password="Capstone",
        database="Electric",
        host="127.0.0.1"
    )
    return db

private_key, public_key = secur.generate_keys()
private_key_serialized, public_key_serialized = secur.serialize_keys(private_key, public_key)
expectedNonce = secur.generate_nonce()
secur.publickeytovault(public_key_serialized, expectedNonce)


@blueprint.route('/add_energy_data', methods=['POST'])
def add_energy_data():
    try:
        #get from website input
        data = request.get_json()
        print("data: ",data)
        userId = data['userId']
        energyProvider = data['energyProvider']
        accountNumber = data['accountNumber']
        encryptedpassword = data['password']
        nonce = data['nonce']
        password = secur.decrypt_message_with_private_key(encryptedpassword, nonce, expectedNonce, private_key_serialized)

       # add account_details
        credentials = {"account_number": accountNumber, "password": password }
        account_details = webscrape.parse_account_info(credentials)
        address = account_details["address"]
        accountName = account_details["accountName"]
        phoneNumber = account_details["phoneNumber"]
        
        addEnergyDetails(userId, energyProvider,accountNumber,encryptedpassword,address,accountName, phoneNumber)
        
        
        # add account_details
        fromDate = date.today() + relativedelta(months=-1)
        toDate = date.today()
        energyUsage = webscrape.download_data(credentials, fromDate, toDate, "csv")
        totalOnPeak = energyUsage["roundedOnPeak"]
        totalOffPeak = energyUsage["roundedOffPeak"]
        totalMidOff = energyUsage["roundedMidPeak"]
        
        
        addEnergyUsage(userId,totalOnPeak,totalOffPeak,totalMidOff,fromDate,toDate)
       
        return jsonify({"message": "Energy data added successfully"})
    except Exception as e:
        return jsonify({"error": str(e)})



@blueprint.route('/get_energy_usage_data/<int:userId>', methods=['GET'])
def get_energy_usage_data(userId):
    try:
        db = connect_to_database()
        cursor = db.cursor()
        cursor.execute("SELECT Total_On_Peak, Total_Off_Peak,Total_Mid_Peak FROM Electricity_Usage WHERE UserID = %s", (userId,))
        energyUsage = cursor.fetchall()

        return jsonify({'energyUsage': energyUsage})

    except Exception as e:
        return jsonify({'error': str(e)})
    finally:
        cursor.close()



def addEnergyDetails(userId, energyProvider,accountNumber,password,address,accountName, phoneNumber):
        db = connect_to_database()
        cursor = db.cursor()
        cursor.execute("INSERT INTO Energy_Account (UserID, EnergyProvider , AccountNumber, Password , Address, AccountName ,  PhoneNumber  ) VALUES (%s, %s, %s,%s,%s,%s,%s)", (userId, energyProvider,accountNumber,password,address,accountName, phoneNumber))
        db.commit()
        cursor.close()
        db.close()    


def addEnergyUsage(userID, totalOnPeak, totalOffPeak, totalMidOff, fromDate, toDate):
    db = connect_to_database()
    cursor = db.cursor()
    # Use userID (consistent with the function parameter)
    cursor.execute("INSERT INTO Electricity_Usage (UserID, Total_On_Peak, Total_Off_Peak, Total_Mid_Peak, From_Date, To_Date) VALUES (%s, %s, %s, %s, %s, %s)", (userID, totalOnPeak, totalOffPeak, totalMidOff, fromDate, toDate))
    db.commit()
    cursor.close()
    db.close()





