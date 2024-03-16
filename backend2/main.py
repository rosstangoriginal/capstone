# main.py
from flask import Flask
from flask_cors import CORS

from blueprints.basic_endpoints import blueprint as basic_endpoints
from blueprints.jinja_endpoint import blueprint as jinja_template_blueprint
from blueprints.login_endpoints import blueprint as login
from blueprints.vault_write import blueprint as vault_api
from blueprints.create_account_api import blueprint as create_account_api




app = Flask(__name__)
CORS(app)
app.register_blueprint(basic_endpoints)
app.register_blueprint(jinja_template_blueprint)
app.register_blueprint(login)
app.register_blueprint(vault_api)
app.register_blueprint(create_account_api)

if __name__ == "__main__":
    app.run()
