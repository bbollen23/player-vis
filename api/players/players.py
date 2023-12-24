from flask import Blueprint,jsonify
import json
players_bp = Blueprint('players',__name__,url_prefix='/players')

'''Route returning all players'''
@players_bp.route('/',methods=['GET'])
def get_all_players():
  # Load JSON file (no need for additional directory information -- we append the root directory on creation of the Flask App)
  data = json.load(open('soccer_small.json'))
  
  return jsonify(data),200

'''Route returning specific player based on URL path'''
@players_bp.route('/<player_name>',methods=['GET'])
def get_player(player_name):
  # Load JSON file (no need for additional directory information -- we append the root directory on creation of the Flask App)
  data = json.load(open('soccer_small.json'))
  
  # Search through player database
  for player in data:
    #A match is constituted by the inputted name with no spaces matching the player's name in the JSON file with no whitespaces. 
    # This is not case sensitive.
    
    if player['Name'].lower().replace(' ','') == player_name.lower():
      return jsonify(player),200
  
  # If no player was found, return an error.
  return jsonify({'error':'NO_PLAYER_FOUND','error_message':'No player was found with this name.'}),200  