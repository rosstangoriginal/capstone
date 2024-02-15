1. Install a local MySQL Server `https://dev.mysql.com/downloads/installer/`. The client is not needed
2. On setup:
    There will be a password prompt. Set this to `Capstone` as this will be password used to connect to MYSQL as indicated in config file.

    If you already have preset password, than you can change it by using `ALTER USER 'root'@'localhost' IDENTIFIED BY 'Capstone'` using cmd or terminal;

3. Using python, install:
    pip install mysql-connector-python or pip3 install mysql-connector-python on Mac
4. Open file mysql_table_create.py and run (thisbuild the db and tables)
5. You can use mysql_connection.py to establish a client to query from.