import { useState} from 'react';
import { TiArrowUnsorted,TiArrowSortedDown,TiArrowSortedUp } from "react-icons/ti";

function sortByKey(data,key,direction='desc'){
  // Make shallow copy of data. The dataset is not nested, so there is no need for a deep copy.
  let tempData = [...data]
  if(direction === 'desc'){
    tempData.sort((a,b)=>a[key]<=b[key] ? 1:-1)
  } else {
    tempData.sort((a,b)=>a[key]>=b[key] ? 1:-1)
  }
  return tempData
}



export default function PlayersTable({players,setPlayers,staticPlayers,headers,setHeaders,setSelectedPlayer,selectedPlayer}){

  // Stores which header is being highlighted
  const [headerHover,setHeaderHover] = useState("")
  // Stores which column is currently being sorted. Starts as 'Rating' since this how the base dataset is already sorted.
  const [columnSorted,setColumnSorted] = useState({column:'Rating',direction:'desc'})



  const tableHeaders = headers.map(entry => {
      var deleteComponent = <></>
      var sortComponent = <></>

      // If sorted, show the correct sort icon
      if(entry === columnSorted['column']){
        let direction = columnSorted['direction']
        sortComponent = 
          <div  className="sort-column"
          >
            {direction === 'desc' ? <TiArrowSortedDown/> : <TiArrowSortedUp/>}
          </div>
      // If not sorted, show the standard unsorted icon when hovering
      }else if(entry === headerHover){
        sortComponent = 
            <div  className="sort-column">
              <TiArrowUnsorted/>
            </div>
      } 

      // If hovering, show the 'delete' button above the column
      if(entry === headerHover){
        deleteComponent = 
        <div
          className='delete-column'
          onClick = {() => {
            let newHeaders = headers.filter(header => header !== entry)
            // If the column to delete is the column we are sorting on, reset the sorting.
            if(columnSorted['column']===entry){
              setColumnSorted({})
              setPlayers([...staticPlayers])
            }
            setHeaders(newHeaders)
          }}
        ><div>&#x2715; delete</div>
        </div>
      }

      return(
        <div
          onMouseEnter={()=> setHeaderHover(entry)}
          onMouseLeave={() => setHeaderHover("")}
          onClick = {()=>{
            // If unsorted, set to descending
            if(entry !== columnSorted['column']){
              setColumnSorted({'column':entry,'direction':'desc'})
              setPlayers(sortByKey(players,entry,'desc'))
            } else {
              let direction = columnSorted['direction'];
              let newDirection = '';
              // If descending, move to ascending
              if(direction === 'desc'){
                newDirection = 'asc'
              }
              // If the newDirection is '', it means we are already sorted as 'ascending'. Clicking again will unsort the data and reset back to the standard sorting of the entire dataset
              if(newDirection === ''){
                setColumnSorted({})
                setPlayers([...staticPlayers])                
              } else {
                //Otherwise, sort based on descending or ascending.
                setColumnSorted({'column':entry,'direction':newDirection})
                setPlayers(sortByKey(players,entry,newDirection))  
              }
            }
          }}
        >
          {deleteComponent}{entry.replace("_", " ")}{sortComponent}
        </div>
      )
    }
  )

  // Dynnamically set the number of columns in the table to adjust table width.
  const templateColumns = () =>({
    "gridTemplateColumns":`repeat(${headers.length},100px)`
  })

  const playerRows = players.map(player => {
    let key = player['Name'].toLowerCase().replace(' ','');
    // Initialize match key to nothing. If there is no selected player, then the match key is then set. If there is a selected player, this match key is then set. This handles two things: 1) ensures that the players are loaded before getting the key, 2) Allows clicking when no player has yet to be selected.
    let match_key = ''
    if(Object.keys(selectedPlayer).length !== 0){
      match_key = selectedPlayer['Name'].toLowerCase().replace(' ','')
    }
    return(
        <div
          onClick ={()=> key === match_key ? setSelectedPlayer({}):setSelectedPlayer(player)}
          class={key === match_key ? 'row selected' : 'row'}
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