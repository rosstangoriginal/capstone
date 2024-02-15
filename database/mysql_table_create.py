import mysql.connector
from mysql.connector import errorcode
from decouple import config

DB_NAME = config('DB_DATABASE')

def create_database(cursor):
    try:
        cursor.execute(
            "CREATE DATABASE {} DEFAULT CHARACTER SET 'utf8'".format(DB_NAME))
    except mysql.connector.Error as err:
        print("Failed creating database: {}".format(err))
        exit(1)

config = {
  'user': config('DB_USER'),
  'password': config('DB_PASSWORD'),
  'host': config('DB_HOST')
}

try:
    cnx = mysql.connector.connect(**config)
except mysql.connector.Error as err:
  if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
    print("Something is wrong with your user name or password")
  elif err.errno == errorcode.ER_BAD_DB_ERROR:
    print("Database does not exist")
  else:
    print(err)

cursor = cnx.cursor() 

# Create DB
try:
   cursor.execute(f"USE {DB_NAME}")
except mysql.connector.Error as err:
    print("Database {} does not exists.".format(DB_NAME))
    if err.errno == errorcode.ER_BAD_DB_ERROR:
        create_database(cursor)
        print("Database {} created successfully.".format(DB_NAME))
        cnx.database = DB_NAME
    else:
        print(err)

try:
    table = open("tables.txt", 'r')
except:
   print("Files not found")

query = ""
for lines in table: 
   query = query + lines
   if lines.find(";") != -1:
        # End of table
        print("Creating New Table...")
        try: 
            cursor.execute(query)
        except mysql.connector.Error as err:
            if err.errno == errorcode.ER_TABLE_EXISTS_ERROR:
                print("already exists.")
            else:
                print(err.msg)
        else:
           print("OK!")
        query = ""

cursor.close()
cnx.close() 