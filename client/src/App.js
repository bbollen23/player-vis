import './App.css';
import { useState,useEffect} from 'react';
import PlayersTable from './Components/PlayersTable';
import { fetchPlayers,fetchAttributes } from './api.js';
import AttributesModal from './Components/AttributesModal.js';
import NumericalVisualization from './Components/NumericalVisualization.js';
import CategoricalVisualization from './Components/CategoricalVisualization.js';

function App() {
  // Players
  const [players, setPlayers] = useState([]);

  //Single Player

  const [selectedPlayer,setSelectedPlayer] = useState({})
  // Used to store original order of players.
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

  //Not used: Club_Joining, Contract_Expiry,Birth_Date,Name
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

  //Attributes where the range is known, but does not fall within the standard 0-100 for the numerical categories
  const OrderedBinsMap = {
    "Weak_foot":5,
    "Skill_Moves":5
  }

  //Get all current categorical attributes present
  const currCategoricalAttributes = categoricalAttributes.filter(entry => headers.includes(entry))

  // For animation of add-columns button
  const [clicked,setClicked] = useState(false)

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



  return (
    <div className="App">
      <div className='main-column-container'>
        <div className='main-header-container'>
          <div className="main-header">Soccer Players</div>
          <div className={clicked? 'add-columns-button clicked':'add-columns-button'}
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
        <div className='categorical-vis-container'>
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
        <div class='categorical-vis-container'>
          <NumericalVisualization
            players={players}
            headers={headers}
            selectedPlayer={selectedPlayer}
          />
        </div>
      </div>
      {Object.keys(selectedPlayer).length !==0 ? <div style={{position:'absolute',top:'54px',right:'108px',textAlign:'right',fontSize:"0.8em",border:"1px solid #D9D9D9",borderRadius:'20px',padding:'5px 10px'}}>Selected Player: <b>{selectedPlayer.Name}</b></div>:<></>}




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
