# General Overview

This visualization uses a Flask API as a back-end and a React + D3.js front-end (with no React.js framework). If this was to be put into production, the user can build the react application and then access the front end by using the default path ("/") for the API (e.g. http://localhost:5000/)

# Application Setup
To start, we'll need to install the proper npm and python packages. This was developed using the following base versions:

-- npm version 8.12.1
-- pip version 20.0.2
-- python3 version 3.8.10
-- Node version 18.4.0

Since this is a very minimal application, any version above these is expected to work properly. 

If you'd like to, you can use a python3 virtual environment to ensure that no pip packages you install will interfere with your existing pip packages. To do this, you can simply use the following:

```
python3 -m venv .venv
. .venv/bin/activate  
```

Now, install the necessary python3 packages using the following:

```pip install -r ./api/requirements.txt```

Use `pip3` if that is your respective pip command for Python3.

After this, you can install the necessary npm packages. First, move to the `client` directory where the React application is located.

```
cd client
npm install
```

Once that is finished, we can now run the application

# Run the Application
There are two ways to run the application. The first is to build the React application and then only use the Flask Application as our entry point. The second is to start both applications separately.

## Running the application only using Flask

_A quick note on Flask Port Selection_: In the client folder, there is a file called `.env`. The only variable in this environment file is the base URL for all API requests. If you decide to _not_ use the standard port 5000 for the Flask application, you _must_ change this variable to use the correct port. This also must be done before starting the React application or before building it. There is no error handling in this application for not being able to connect to the API as it is meant to be a simple application. In production, a more robust error handling system would be normally introduced.

Move to the client directory and build the React application. From the last step, you may already be in the client directory. Once there, call the following:

```
npm run build
```

This will build the React application and output a `build` folder inside the `client` directory. This contains an `index.html` file which will be referenced in our Flask Application as the entry point. There is no routing in this single page web application, so the `index.html` file is the only static file that will be served.

Move into the `api` directory and start the Flask server.

```
cd ../api
flask --app app run
```
By default, this will serve the application on port 5000. You can adjust this accordingly using the `port` argument. For example, running on port "3001" would require the command `flask --app app run --port=3002`. Make sure to adjust the client `.env` file accordingly if the port is changed.

You can now access the application by using "http://localhost:5000/" fully in your Web browser (adjust the port as necessary).

## Running the application using Flask and React

When developing, it may be easier to start the application separately so that you do not have to 're-build' the React application anytime a change is made. 

Move into the api directory and start the Flask application. This is assuming you are currently in the root directory of the repository

```
cd api
flask --app app run
```
Now that the Flask server is running (with a default port of 5000), move into the client directory and start the React application.
```
cd ../client
npm start
```

Now your React applicaiton is running on port 3000. To access the application, you can visit "http://localhost:3000".

# API Endpoints

### `/players`
**Method:** GET
**Description:** Returns all players as a JSON object list.
**Example:** `curl http://localhost:5000/players/`
**Example Return Response:**
```
[
  {
   "Name": "Cristiano Ronaldo",
   "Nationality": "Portugal",
   "National_Position": "LS",
   "National_Kit": 7,
   "Club": "Real Madrid",
   "Club_Position": "LW",
   "Club_Kit": 7,
   "Club_Joining": "07/01/2009",
   "Contract_Expiry": 2021,
   "Rating": 94,
   "Height": "185 cm",
   "Weight": "80 kg",
   "Preffered_Foot": "Right",
   "Birth_Date": "02/05/1985",
   "Age": 32,
   "Preffered_Position": "LW/ST",
   "Work_Rate": "High / Low",
   "Weak_foot": 4,
   "Skill_Moves": 5,
   "Ball_Control": 93,
   "Dribbling": 92,
   "Marking": 22,
   "Sliding_Tackle": 23,
   "Standing_Tackle": 31,
   "Aggression": 63,
   "Reactions": 96,
   "Attacking_Position": 94,
   "Interceptions": 29,
   "Vision": 85,
   "Composure": 86,
   "Crossing": 84,
   "Short_Pass": 83,
   "Long_Pass": 77,
   "Acceleration": 91,
   "Speed": 92,
   "Stamina": 92,
   "Strength": 80,
   "Balance": 63,
   "Agility": 90,
   "Jumping": 95,
   "Heading": 85,
   "Shot_Power": 92,
   "Finishing": 93,
   "Long_Shots": 90,
   "Curve": 81,
   "Freekick_Accuracy": 76,
   "Penalties": 85,
   "Volleys": 88,
   "GK_Positioning": 14,
   "GK_Diving": 7,
   "GK_Kicking": 15,
   "GK_Handling": 11,
   "GK_Reflexes": 11    
  },
  .
  .
  .
  {
      "Name": "Diego Costa",
   "Nationality": "Spain",
   "National_Position": "ST",
   "National_Kit": 19,
   "Club": "Chelsea",
   "Club_Position": "ST",
   "Club_Kit": 19,
   "Club_Joining": "07/15/2014",
   "Contract_Expiry": 2019,
   "Rating": 86,
   "Height": "188 cm",
   "Weight": "85 kg",
   "Preffered_Foot": "Right",
   "Birth_Date": "10/07/1988",
   "Age": 28,
   "Preffered_Position": "ST",
   "Work_Rate": "High / Medium",
   "Weak_foot": 4,
   "Skill_Moves": 3,
   "Ball_Control": 83,
   "Dribbling": 79,
   "Marking": 28,
   "Sliding_Tackle": 34,
   "Standing_Tackle": 39,
   "Aggression": 93,
   "Reactions": 85,
   "Attacking_Position": 88,
   "Interceptions": 40,
   "Vision": 74,
   "Composure": 84,
   "Crossing": 65,
   "Short_Pass": 67,
   "Long_Pass": 52,
   "Acceleration": 76,
   "Speed": 78,
   "Stamina": 85,
   "Strength": 91,
   "Balance": 52,
   "Agility": 58,
   "Jumping": 64,
   "Heading": 82,
   "Shot_Power": 84,
   "Finishing": 89,
   "Long_Shots": 72,
   "Curve": 62,
   "Freekick_Accuracy": 59,
   "Penalties": 76,
   "Volleys": 82,
   "GK_Positioning": 8,
   "GK_Diving": 11,
   "GK_Kicking": 12,
   "GK_Handling": 13,
   "GK_Reflexes": 11 
  }
]
```

### `/players/{player_name}`
**Method:** GET
**Description:** Returns single player JSON object.
**Example:** `curl http://localhost:5000/players/CristianoRonaldo`
**Example Return Response:**
```
{
  "Name": "Cristiano Ronaldo",
  "Nationality": "Portugal",
  "National_Position": "LS",
  "National_Kit": 7,
  "Club": "Real Madrid",
  "Club_Position": "LW",
  "Club_Kit": 7,
  "Club_Joining": "07/01/2009",
  "Contract_Expiry": 2021,
  "Rating": 94,
  "Height": "185 cm",
  "Weight": "80 kg",
  "Preffered_Foot": "Right",
  "Birth_Date": "02/05/1985",
  "Age": 32,
  "Preffered_Position": "LW/ST",
  "Work_Rate": "High / Low",
  "Weak_foot": 4,
  "Skill_Moves": 5,
  "Ball_Control": 93,
  "Dribbling": 92,
  "Marking": 22,
  "Sliding_Tackle": 23,
  "Standing_Tackle": 31,
  "Aggression": 63,
  "Reactions": 96,
  "Attacking_Position": 94,
  "Interceptions": 29,
  "Vision": 85,
  "Composure": 86,
  "Crossing": 84,
  "Short_Pass": 83,
  "Long_Pass": 77,
  "Acceleration": 91,
  "Speed": 92,
  "Stamina": 92,
  "Strength": 80,
  "Balance": 63,
  "Agility": 90,
  "Jumping": 95,
  "Heading": 85,
  "Shot_Power": 92,
  "Finishing": 93,
  "Long_Shots": 90,
  "Curve": 81,
  "Freekick_Accuracy": 76,
  "Penalties": 85,
  "Volleys": 88,
  "GK_Positioning": 14,
  "GK_Diving": 7,
  "GK_Kicking": 15,
  "GK_Handling": 11,
  "GK_Reflexes": 11
}
```

### `/attributes`
**Method:** GET
**Description:** Returns all attributes as a JSON list.
**Example:** `curl http://localhost:5000/attributes/`
**Example Return Response:**
```
["Name","Nationality","National_Position","National_Kit","Club","Club_Position","Club_Kit","Club_Joining","Contract_Expiry","Rating","Height","Weight","Preffered_Foot","Birth_Date","Age","Preffered_Position","Work_Rate","Weak_foot","Skill_Moves","Ball_Control","Dribbling","Marking","Sliding_Tackle","Standing_Tackle","Aggression","Reactions","Attacking_Position","Interceptions","Vision","Composure","Crossing","Short_Pass","Long_Pass","Acceleration","Speed","Stamina","Strength","Balance","Agility","Jumping","Heading","Shot_Power","Finishing","Long_Shots","Curve","Freekick_Accuracy","Penalties","Volleys","GK_Positioning","GK_Diving","GK_Kicking","GK_Handling","GK_Reflexes"]
```
### `/clubs`
**Method:** GET
**Description:** Returns the list of clubs and all the players associated with them as a JSON object.
**Example:** `curl http://localhost:5000/clubs/`
**Example Return Response:**
```
{"Arsenal":["Mesut \u00d6zil","Alexis S\u00e1nchez","Petr \u010cech"],"Atl\u00e9tico Madrid":["Antoine Griezmann","Diego God\u00edn","Jan Oblak"],"Bayer 04":["Bernd Leno"],"Bor. Dortmund":["Marco Reus","Pierre-Emerick Aubameyang"],"Chelsea":["Thibaut Courtois","Eden Hazard","Diego Costa"],"FC Barcelona":["Lionel Messi","Neymar","Luis Su\u00e1rez","Iniesta","Ivan Rakiti\u0107","Piqu\u00e9","Sergio Busquets","Jordi Alba"],"FC Bayern":["Manuel Neuer","Robert Lewandowski","J\u00e9r\u00f4me Boateng","Mats Hummels","Philipp Lahm","Arturo Vidal","Arjen Robben","David Alaba","Thomas M\u00fcller","Thiago"],"Inter":["Samir Handanovi\u010d"],"Juventus":["Gonzalo Higua\u00edn","Giorgio Chiellini","Gianluigi Buffon","Leonardo Bonucci","Paulo Dybala"],"Liverpool":["Coutinho"],"Manchester City":["Sergio Ag\u00fcero","Kevin De Bruyne","David Silva"],"Manchester Utd":["De Gea","Zlatan Ibrahimovi\u0107","Paul Pogba","Henrikh Mkhitaryan"],"PSG":["Thiago Silva","Marco Verratti","\u00c1ngel Di Mar\u00eda"],"Real Madrid":["Cristiano Ronaldo","Gareth Bale","Luka Modri\u0107","Sergio Ramos","Toni Kroos","Pepe","James Rodr\u00edguez"],"Spurs":["Hugo Lloris"]}
```

# Additional Visualization Information

## Reason for not using a standard dropdown for attribute selection.
When working on this visualization, I felt that a standard "dropdown" which allowed the user to select and de-select attributes would occlude the view too much and not allow for a full visual of all possible attributes at once. Instead, I implemented a modal which is opened when clicking the "Add Attributes" button. This modal shows all of the possible attributes in one view with a simple way to select and de-select the attributes.

## Attributes not in the visualizations

There are several attributes which I chose not to add to the visualization but are present in the table. These are as follows:

- Name
- Club_Joining
- Contract_expiry
- Rating
- Birth_Date

We exclude 'Rating' because this attribute is essentially an average of the other numerical attributes. It felt unnecessary to include this in the visualization as it would provide the same information that is already provided when adding other attributes. The other excluded attributes are non-essential to understanding the player's skills.

## Categorical vs Numerical Attributes

In the visualization, we have a section for the categorical attributes and the numerical attributes. However, because we chose to do a Ridgeline plot/Joy plot for the numerical attributes, there are certain attributes that have an order to them, but do not fall into the standard 1 to 100 range that the others do. These `middle-ground` attributes are as follows:

- Weight
- Height
- Age
- Perffered_Foot
- Weak_foot
- Skill_Moves

Because of this, these were placed in the categorical attributes visualization (vertical histograms). However, since they naturally have an order to them, we took the extra step of ordering the y-axis for these attributes based on their value. Conversely, for categorical attributes which do _not_ have an inherent order to their domain, they are ordered by the value number. For example, the histogram for the "Nationality" attribute will be ordered on the y-axis by the number of players for the respective Nation in descending order -- meaning Germany and Spain will be the top two values. For Age, the y-axis is ordered by the Age bands in descending order.

