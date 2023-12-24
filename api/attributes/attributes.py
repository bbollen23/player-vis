from flask import Blueprint,jsonify
import json

attributes_bp = Blueprint('attributes',__name__,url_prefix='/attributes')

'''Route returning all attributes'''
@attributes_bp.route('/',methods=['GET'])
def get_attributes():
  # Load data
  data = json.load(open('soccer_small.json'))
  
  # Assuming all players have the same attributes, we just load in the first user, get the keys for the json object, then convert it to a list so that it is JSON serializable. 
  attributes = list(data[0].keys())
  return jsonify(attributes),200
  
  