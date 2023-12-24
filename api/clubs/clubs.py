from flask import Blueprint,jsonify
import json

clubs_bp = Blueprint('clubs',__name__,url_prefix='/clubs')

'''Route returning all clubs and their respective players'''
@clubs_bp.route('/',methods=['GET'])
def get_clubs():
  # Load data
  data = json.load(open('soccer_small.json'))
  
  # Initialize empty dictionary for clubs
  clubs = {}

  for player in data:
    club = player['Club']
    # If list for this particular club already initialized, append player Name
    if club in clubs:
      clubs[club].append(player['Name'])
    # Otherwise, make new list with only this player as entry
    else:
      
      clubs[club] = [player['Name']]
  
  return jsonify(clubs),200 
  