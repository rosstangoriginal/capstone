1. Clone the repository
2. Navigate to the backend directory by using `cd CAPSTONE\backend2`
3. Install the required Python packages listed in the `requirements.txt` file by running `pip install -r requirements.txt`. If on Mac, use `pip3 install -r requirements.txt`
4. You need to setup Vault:
    - Install HashiCorp Vault based on your system https://developer.hashicorp.com/vault/install#windows
    - Run "vault server -dev" on normal terminal to start a development server.  After starting the dev server, a token will be provided in terminal called "Root Token".  Copy this.
    - Now you should be able to access vault using 'http://127.0.0.1:8200/ui/vault/auth?with=token' on the browser
    - Enter as your token the copied Root Token, and you will not have the vault running
5. Run the application by executing `python main.py`