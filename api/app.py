import sys
import os

# Get current working directory for the main file.
current_dir = os.path.dirname(os.path.realpath(__file__))
# Get the parent directory
parent_dir = os.path.abspath(os.path.join(current_dir, os.pardir))
# Append the parent directory to the system path so allow imports from 'api'.
sys.path.append(parent_dir)


from flask import Flask
from api.players.players import players_bp
from api.clubs.clubs import clubs_bp
from api.attributes.attributes import attributes_bp
from flask_cors import CORS

# Set the static folder and the static url path for the React application
app = Flask(__name__,static_folder='../client/build',static_url_path='/')
# This CORS is required when starting the React app separately from the Flask app for testing. When moved into prodution, this can be removed (i.e. when you have a build of the React App and are accessing the index.html of the React app through the Flask App)
CORS(app)
app.register_blueprint(players_bp)
app.register_blueprint(clubs_bp)
app.register_blueprint(attributes_bp)

# Route which returns the index.html file of the react application
@app.route("/",methods=['GET'])
def index():
  return app.send_static_file('index.html')


