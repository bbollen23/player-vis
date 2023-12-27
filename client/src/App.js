import './App.css';
import { useState,useEffect} from 'react';
import PlayersTable from './Components/PlayersTable';
import { fetchPlayers,fetchAttributes } from './api.js';
import AttributesModal from './Components/AttributesModal.js';

function App() {
  // Players
  const [players, setPlayers] = useState([]);

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

  // For animation of add-columns button
  const [clicked,setClicked] = useState(false)

  const [modal,showModal] = useState(0)

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
      <div style={{display:'grid',gridTemplateRows:'80px 750px'}}>
        <div className='main-header-container'>
          <div className="main-header">Soccer Players</div>
          <div className={clicked? 'add-columns-button clicked':'add-columns-button'}
          onMouseDown={() => {setClicked(true)}}
          onMouseUp={()=>{
            setClicked(false)
            showModal(1)
          }}
          >Add Attributes</div>
        </div>
        <PlayersTable
          players={players}
          setPlayers={setPlayers}
          staticPlayers={staticPlayers}
          headers={headers}
          setHeaders={setHeaders}
        />
      </div>
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
