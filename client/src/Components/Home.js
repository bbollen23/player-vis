import { useState,useEffect} from 'react';
import { fetchPlayers } from '../api.js';
import {FaSortAmountDown} from "react-icons/fa";
export default function Home(){
  // Players
  const [players, setPlayers] = useState([]);
  const [headers,setHeaders] = useState([
    "Name",
    "Nationality",
    "National_Position",
    "Club",
    "Height",
    "Weight",
    "Preffered_Foot",
    "Rating",
  ])

  const [headerHover,setHeaderHover] = useState("")
  const [selected,setSelected] = useState("")

  // Fetch All Players
  useEffect(() => {
    fetchPlayers().then(playersReturned=>{
      setPlayers(playersReturned)
    });
  }, []);

  const tableHeaders = headers.map(entry => {
      var deleteComponent = <></>
      var sortComponent = <></>

      // When hovering, deleteComponent and sortComponent become non-empty
      if(entry === headerHover){
        deleteComponent = 
          <div
            className='delete-column'
            onClick = {() => {
              let newHeaders = headers.filter(header => header !== entry)
              setHeaders(newHeaders)
            }}
          ><div>&#x2715;</div>
        </div>
        sortComponent = 
            <div  className="sort-column">
              <FaSortAmountDown/>
            </div>
      }

      return(
        <div
          onMouseEnter={()=>setHeaderHover(entry)}
          onMouseLeave={() => setHeaderHover("")}
        >
          {deleteComponent}{entry.replace("_", " ")}{sortComponent}
        </div>
      )
    }
  )

  // Dynnamically set the number of columns in the table to adjust table width.
  const templateColumns = () =>({
    "gridTemplateColumns":`repeat(${headers.length},150px)`
  })

  const playerRows = players.map(player => {
    let key = player['Name'].toLowerCase().replace(' ','');


    return(
        <div
          onClick ={()=>setSelected(key)}
          class={key === selected ? 'row selected' : 'row'}
          style={templateColumns()}
          key={key}>
            {headers.map(entry=><div>{player[entry]}</div>)}
        </div>
      )
    }
  )
  return(
    <div className='main-table-container'>
      <div className='header row' style={templateColumns()}>
        {tableHeaders}
      </div>
      <div className='row'>
        {playerRows}
      </div>
    </div>
  )

}