from bs4 import BeautifulSoup

# Load your HTML into a variable. In a real scenario, you would load the HTML content from a file or a web request.
# For this example, assuming the HTML content is stored in a variable named 'html_content'.
html_content = """Your HTML content here"""

# Create a BeautifulSoup object and specify the parser
soup = BeautifulSoup(html_content, 'html.parser')

import datetime
from datetime import date
import csv
import io
from dateutil.relativedelta import relativedelta
from requests_html import HTMLSession
import mysql.connector
from bs4 import BeautifulSoup
import re



def extract_key(link):
    regex = re.compile("\\?key=(?P<key>.+)")
    m = regex.search(link)
    return m.group("key") if m else None

def download_data(credentials, from_date: datetime.date, to_date: datetime.date, format: str = "csv", hourly: bool = True):
    if format == "csv":
        form_name = "downloadData2Spreadsheet"
        app = "ExcelExport"
    else:
        form_name = "downloadXml"
        app = "FileDownloader"

    with HTMLSession() as s:
        s.post(
            "https://myaccount.alectrautilities.com/app/capricorn?para=index",
            data={
                "password": credentials["password"],
                "loginBy": "accountNumber",
                "accessCode": credentials["account_number"],
                "password2": credentials["password"],
            },
        )

        form_data = {
            "para": "greenButtonDownload",
            "GB_iso_fromDate": from_date.isoformat(),
            "GB_iso_toDate": to_date.isoformat(),
            "downloadConsumption": "Y" if format == "csv" else "",
            "tab": "GBDL",
            "hourlyOrDaily": "Hourly" if hourly else "Daily",
        }

        r = s.post(
            "https://myaccount.alectrautilities.com/app/capricorn?para=greenButtonDownload",
            data=form_data,
        )

        xslt2_elem = r.html.find(f"form[name={form_name}]", first=True)
        dl_key = extract_key(xslt2_elem.attrs["action"])

        r = s.post(f"https://myaccount.alectrautilities.com/app/{app}?key={dl_key}")

        csv_reader = csv.DictReader(io.StringIO(r.text))
        totalOnPeak = ' Total On-Peak kWh Consumption'
        totalMidPeak = ' Total Mid-Peak kWh Consumption'
        totalOffPeak = ' * Total Off-Peak kWh Consumption'
        
        dataOnPeakList = []
        dataMidPeakList = []
        dataOffPeakList = []
        for row in csv_reader:
            dataOnPeak = row.get(totalOnPeak)
            dataMidPeak = row.get(totalMidPeak)
            dataOffPeak = row.get(totalOffPeak)         
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
        
        rounded_values = {
            "roundedOnPeak": roundedOnPeak,
            "roundedMidPeak": roundedMidPeak,
            "roundedOffPeak": roundedOffPeak
            }
        return rounded_values

  


        

def parse_account_info(credentials):
    with HTMLSession() as s:
        response = s.post(
            "https://myaccount.alectrautilities.com/app/capricorn?para=index",
            data={
                "password": credentials["password"],
                "loginBy": "accountNumber",
                "accessCode": credentials["account_number"],
                "password2": credentials["password"],
            },
        )

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')

            # file_path = "file2.txt"
            # with open(file_path, "w") as file:
            #     file.write(str(soup))
            
            account_name_tag = soup.find("td", string="Account Name: ").find_next_sibling("td")
            account_name = account_name_tag.text if account_name_tag else "Not found"
            
            service_location_tag = soup.find("td", string="Service Location: ").find_next_sibling("td")
            service_location = service_location_tag.text if service_location_tag else "Not found"

            text = soup.get_text()
            
            phone_pattern = r'\(\d{3}\) \d{3}-\d{4}'
            phone_number = "Not found"
            match = re.search(phone_pattern, text)
            
            if match:
                phone_number = match.group(0)

            address = service_location

            account_details = {
            "accountName": account_name,
            "address": address,
            "phoneNumber": phone_number
            }
            
            print(service_location)
            return account_details

if __name__ == "__main__":
    credentials = {"account_number": 8438700000, "password": "Ascwin25."}
    # Set date range for data to fetch
    from_date = date.today() + relativedelta(months=-1)
    to_date = date.today()

    elecdata = download_data(credentials, from_date, to_date, "csv")
    print("Electricity Data:", elecdata)

    print(parse_account_info(credentials))


