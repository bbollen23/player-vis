import sys
import os

# Get current working directory for the main file.
current_dir = os.path.dirname(os.path.realpath(__file__))
# Get the parent directory
parent_dir = os.path.abspath(os.path.join(current_dir, os.pardir))
# Append the parent directory to the system path so allow imports from 'api'.
sys.path.append(parent_dir)


from flask import Flask, json
from api.players.players import players_bp
from api.clubs.clubs import clubs_bp
from api.attributes.attributes import attributes_bp


# Set the static folder and the static url path for the React application
app = Flask(__name__,static_folder='../build',static_url_path='/')
app.register_blueprint(players_bp)
app.register_blueprint(clubs_bp)
app.register_blueprint(attributes_bp)

# Route which returns the index.html file of the react application
@app.route("/",methods=['GET'])
def index():
  return app.send_static_file('index.html')


