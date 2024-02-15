import mysql.connector
from mysql.connector import errorcode
from decouple import config

def mysql_connect():
    try:
        db_host = config('DB_HOST')
        db_user = config('DB_USER')
        db_password = config('DB_PASSWORD')
        db_database = config('DB_DATABASE')

        cnx = mysql.connector.connect(
            host=db_host,
            user=db_user,
            password=db_password,
            database=db_database
        )
        cursor = cnx.cursor()
        return cnx, cursor
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Something is wrong with your user name or password")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("Database does not exist")
        else:
            print(err)
        return None, None

# Create a connection and cursor
cnx, cursor = mysql_connect()

if __name__ == "__main__":
    if cnx and cursor:
        while True:
            query = input("Enter Query (type q to leave):\n")
            if query.lower() == 'q':
                break
            cursor.execute(query)
            for results in cursor.fetchall():
                print(results)

        cnx.close()