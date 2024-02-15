# Alectra Meter Data Download
# (c) 2021 Felix Kaechele <felix@kaechele.ca>
# SPDX-License-Identifier: CC-BY-SA-4.0
import datetime
import re
from datetime import date
import csv
import io

from dateutil.relativedelta import relativedelta
from requests_html import HTMLSession

import mysql.connector

# MySQL configuration
db_config = {
    "host": "127.0.0.1",
    "user": "root",
    "password": "Cps714password",
    "database": "Electric"  # Change to your database name
}

# Function to check user credentials
def account_create(firstname,lastname,password,email,accountnumber):
    try:
        db = mysql.connector.connect(**db_config)
        cursor = db.cursor()

        query = "INSERT INTO User (FirstName, LastName, Password, Email, AccountNumber)  VALUES (%s, %s, %s, %s, %s)"
        values = (firstname,lastname,password,email,accountnumber)
        cursor.execute(query, values)

        # Commit the changes to the database
        db.commit()

        # Check if any rows were affected (optional)
        affected_rows = cursor.rowcount

        if affected_rows > 0:
            return True
        else:
            return False
    except Exception as e:
        print("Error:", e)
        return False
    finally:
        if db:
            db.close()


# Function to check user credentials
def electr_insert(userid,total_on_peak,total_off_peak,total_mid_peak,from_date,to_date):
    try:
        db = mysql.connector.connect(**db_config)
        cursor = db.cursor()

        query = "INSERT INTO electricity_usage (userid, total_on_peak, total_off_peak, total_mid_peak, from_date, to_date) VALUES (%s, %s, %s,%s, %s, %s)"
        values = (userid,total_on_peak,total_off_peak,total_mid_peak,from_date,to_date)
        cursor.execute(query, values)

        # Commit the changes to the database
        db.commit()

        # Check if any rows were affected (optional)
        affected_rows = cursor.rowcount

        if affected_rows > 0:
            return True
        else:
            return False
    except Exception as e:
        print("Error:", e)
        return False
    finally:
        if db:
            db.close()


def extract_key(link):
    regex = re.compile("\\?key=(?P<key>.+)")
    m = regex.search(link)
    return m.group("key")


def download_data(
    credentials,
    from_date: datetime.date,
    to_date: datetime.date,
    format: str = "csv",
    hourly: bool = True,
):
    if format == "csv":
        form_name = "downloadData2Spreadsheet"
        app = "ExcelExport"
    else:
        form_name = "downloadXml"
        app = "FileDownloader"

    with HTMLSession() as s:
        # Login and establish session
        s.post(
            "https://myaccount.alectrautilities.com/app/capricorn?para=index",
            data={
                "password": credentials["password"],
                "loginBy": "accountNumber",
                "accessCode": credentials["account_number"],
                "password2": credentials["password"],
            },
        )

        # Form data for download request
        form_data = {
            "para": "greenButtonDownload",
            "GB_iso_fromDate": from_date.isoformat(),
            "GB_iso_toDate": to_date.isoformat(),
            "downloadConsumption": "Y" if format == "csv" else "",
            "tab": "GBDL",
            "hourlyOrDaily": "Hourly" if hourly else "Daily",
        }

        # Issue download request to retreive Download Key
        r = s.post(
            "https://myaccount.alectrautilities.com/app/capricorn"
            "?para=greenButtonDownload",
            data=form_data,
        )

        # Extract key
        xslt2_elem = r.html.find(f"form[name={form_name}]", first=True)
        dl_key = extract_key(xslt2_elem.attrs["action"])

        r = s.post(
            f"https://myaccount.alectrautilities.com/app/{app}?key={dl_key}"
        )

        return r.text


if __name__ == "__main__":
    # Your Alectra login details
    credentials = {"account_number": 8438700000, "password": "Ascwin25."}
    # account_create(str(credentials["account_number"]),credentials["password"],'sample@gmail.com')
    # account_create('aaron','bur','password','sample@gmail.com',"8908080989")


    # Set date range for data to fetch
    # Example: last month from today
    from_date = date.today() + relativedelta(months=-1)
    to_date = datetime.date.today()

    # print("fromdate: " + str(from_date))

    # Download Hourly Data as CSV

    elecdata = download_data(credentials, from_date, to_date, "csv");
    print("elec: " + elecdata)

        # Use csv module to parse the CSV data
    csv_reader = csv.DictReader(io.StringIO(elecdata))


        # Specify the header you want to extract data from (replace 'YourHeader' with the actual header)

    
    totalOnPeak = ' Total On-Peak kWh Consumption'
    totalMidPeak = ' Total Mid-Peak kWh Consumption'
    totalOffPeak = ' * Total Off-Peak kWh Consumption'
    
    
    
    dataOnPeakList = []
    dataMidPeakList = []
    dataOffPeakList = []
    
    
    for row in csv_reader:
         # Access data from the specified header
          dataOnPeak = row.get(totalOnPeak) #data_from_desired_header
          dataMidPeak = row.get(totalMidPeak)
          dataOffPeak = row.get(totalOffPeak)
          
          # Check if the data is not None before appending to the list
          if dataOnPeak is not None:
            dataOnPeakList.append(dataOnPeak)

          if dataMidPeak is not None:
            dataMidPeakList.append(dataMidPeak)

          if dataOffPeak is not None:
            dataOffPeakList.append(dataOffPeak)
            
    sumOnPeak = 0
    sumMidPeak = 0
    sumOffPeak = 0
        
    for i in dataOnPeakList:
        sumOnPeak += float(i)
        
    for i in dataMidPeakList:
        sumMidPeak += float(i)
        
    for i in dataOffPeakList:
        sumOffPeak += float(i)
        
    roundedOnPeak = round(sumOnPeak, 2)
    roundedMidPeak = round(sumMidPeak,2)
    roundedOffPeak = round(sumOffPeak,2)
        
    print("hiuihi")
    print("onpeak total: " + str(roundedOnPeak))
    print("midpeak total: " + str(roundedMidPeak))
    print("offpeak total: " + str(roundedOffPeak))
    print("fromdate: " + str(from_date))
    print("todate: " + str(to_date))

    electr_insert(1,roundedOnPeak,roundedMidPeak,roundedOffPeak,str(from_date),str(to_date))






    # Download Hourly Data as XML
    # ESPI Schema: https://www.naesb.org/ESPI_Standards.asp
    # XML also allows to get Daily instead of Hourly data.
    # To do so add a hourly=False parameter.
    # print(download_data(credentials, from_date, to_date, "xml"))