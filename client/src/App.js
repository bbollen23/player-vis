import './App.css';
import { useState,useEffect} from 'react';
import PlayersTable from './Components/PlayersTable';
import { fetchPlayers,fetchAttributes } from './api.js';
import AttributesModal from './Components/AttributesModal.js';
import NumericalVisualization from './Components/NumericalVisualization.js';
import CategoricalVisualization from './Components/CategoricalVisualization.js';

// Main entry point for application. Most of our state is set here and passed to the individual components since they each will be interacting with each other. 

function App() {
  // Players
  const [players, setPlayers] = useState([]);

  //Single Player
  const [selectedPlayer,setSelectedPlayer] = useState({})

  // Used to store original order of players. This comes in handy when we want to essentially "unsort" a column.
  const [staticPlayers,setStaticPlayers] = useState([]);
  
  //Used to get and store the set of all attributes
  const [attributes,setAttributes] = useState([])

  // Used for determining current attributes
  const [headers,setHeaders] = useState([
    "Name",
    "Rating",
    "Nationality",
    "National_Position",
    "Club",
    "Height",
    "Weight",
    "Preffered_Foot"
  ])



  // For animation of 'Add Attriutes' button
  const [clicked,setClicked] = useState(false)

  //Opening and closing Attributes modal state
  const [modal,showModal] = useState(false)

  // Fetch All Players
  useEffect(() => {
    fetchPlayers().then(playersReturned=>{
      setPlayers(playersReturned)
      // Make a shallow copy of the players and store in the staticPlayers state value
      setStaticPlayers([...playersReturned])
      fetchAttributes().then(attributesReturned=>{
        setAttributes(attributesReturned)
      })
      }
    );
  }, []);

  const categoricalAttributes = [
    "Nationality",
    "National_Position",
    "National_Kit",
    "Club",
    "Club_Position",
    "Club_Kit",
    "Height",
    "Weight",
    "Preffered_Foot",
    "Age",
    "Preffered_Position",
    "Work_Rate",
    "Weak_foot",
    "Skill_Moves"
  ]

  // Set of attributes which are categorical, but are still ordered
  const isOrderedList = [
    'Weight',
    'Height',
    'Age',
    'Weak_foot',
    'Skill_Moves'
  ]

  //Attributes where the range is known, but does not fall within the standard 0-100 for the numerical categories. We want to bin these differently than d3's automatic binning.
  const OrderedBinsMap = {
    "Weak_foot":5,
    "Skill_Moves":5
  }

  //Get all current categorical attributes present
  const currCategoricalAttributes = categoricalAttributes.filter(entry => headers.includes(entry))

  const numericalKeys = [
    "Ball_Control",
    "Dribbling",
    "Marking",
    "Sliding_Tackle",
    "Standing_Tackle",
    "Aggression",
    "Reactions",
    "Attacking_Position",
    "Interceptions",
    "Vision",
    "Composure",
    "Crossing",
    "Short_Pass",
    "Long_Pass",
    "Acceleration",
    "Speed",
    "Stamina",
    "Strength",
    "Balance",
    "Agility",
    "Jumping",
    "Heading",
    "Shot_Power",
    "Finishing",
    "Long_Shots",
    "Curve",
    "Freekick_Accuracy",
    "Penalties",
    "Volleys",
    "GK_Positioning",
    "GK_Diving",
    "GK_Kicking",
    "GK_Handling",
    "GK_Reflexes",
  ]


  // List of intersected headers (i.e. different types of histograms)
  const currentNumericalAttributes = numericalKeys.filter(entry => headers.includes(entry))


  return (
    <div className="App">
      <div className='main-column-container'>
        <div className='main-header-container'>
          <div className="main-header">Soccer Players</div>
          <div className={clicked? 'add-attributes-button clicked':'add-attributes-button'}
          onMouseDown={() => {setClicked(true)}}
          onMouseUp={()=>{
            setClicked(false)
            showModal(true)
          }}
          onMouseLeave={()=>{
            setClicked(false)
          }}
          >Add Attributes</div>
        </div>
        <PlayersTable
          players={players}
          setPlayers={setPlayers}
          staticPlayers={staticPlayers}
          headers={headers}
          setHeaders={setHeaders}
          selectedPlayer={selectedPlayer}
          setSelectedPlayer={setSelectedPlayer}
        />
      </div>
      <div className='main-column-container'>
        <div className = 'main-header-container'>
          <div className='main-header'>
            Categorical Attributes
          </div>
        </div>
        <div className='vis-container'>
          {players.length !== 0 ? currCategoricalAttributes.map(entry =>
            <CategoricalVisualization
              attribute={entry}
              players={players}
              selectedPlayer={selectedPlayer}
              ordered={isOrderedList.includes(entry)}
              nbins={Object.keys(OrderedBinsMap).includes(entry)? OrderedBinsMap[entry]:null}
            />
          )
          :<></>}
        </div>
      </div>
      <div className='main-column-container'>
        <div className = 'main-header-container'>
          <div className='main-header'>
            Numerical Attributes
          </div>
        </div>
        <div class='vis-container'>
          <NumericalVisualization
            players={players}
            selectedPlayer={selectedPlayer}
            currentNumericalAttributes={currentNumericalAttributes}
          />
        </div>
      </div>
      {Object.keys(selectedPlayer).length !==0 ? 
        <div className='player-pill'>
          Selected Player: <b>{selectedPlayer.Name}</b>
        </div>:<></>}

      <AttributesModal
        attributes={attributes}
        headers={headers}
        setHeaders={setHeaders}
        modal={modal}
        showModal={showModal}
      />
    </div>
  );
}

export default App;
