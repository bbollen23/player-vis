import { useState} from 'react';
import { TiArrowUnsorted,TiArrowSortedDown,TiArrowSortedUp } from "react-icons/ti";

function sortByKey(data,key,direction='desc'){
  // Make shallow copy of data. JSON is not nested, so this will work over a deep copy
  let tempData = [...data]
  if(direction === 'desc'){
    tempData.sort((a,b)=>a[key]<=b[key] ? 1:-1)
  } else {
    tempData.sort((a,b)=>a[key]>=b[key] ? 1:-1)
  }
  return tempData
}



export default function PlayersTable({players,setPlayers,staticPlayers,headers,setHeaders}){

  // Stored which header is being highlighted
  const [headerHover,setHeaderHover] = useState("")
  // Stores which player is selected
  const [selected,setSelected] = useState("")
  // Stores which column is currently being sorted
  const [columnSorted,setColumnSorted] = useState({column:'Rating',direction:'desc'})



  const tableHeaders = headers.map(entry => {
      var deleteComponent = <></>
      var sortComponent = <></>

      if(entry === columnSorted['column']){
        let direction = columnSorted['direction']
        sortComponent = 
          <div  className="sort-column"
          >
            {direction === 'desc' ? <TiArrowSortedDown/> : <TiArrowSortedUp/>}
          </div>
      }else if(entry === headerHover){
        sortComponent = 
            <div  className="sort-column">
              <TiArrowUnsorted/>
            </div>
      } 

      // If hovering over the column
      if(entry === headerHover){
        deleteComponent = 
        <div
          className='delete-column'
          onClick = {() => {
            
            let newHeaders = headers.filter(header => header !== entry)
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
            if(entry !== columnSorted['column']){
              setColumnSorted({'column':entry,'direction':'desc'})
              setPlayers(sortByKey(players,entry,'desc'))
            } else {
              let direction = columnSorted['direction'];
              let newDirection = '';
              if(direction === 'desc'){
                newDirection = 'asc'
              }
              if(newDirection === ''){
                setColumnSorted({})
                setPlayers([...staticPlayers])                
              } else {
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

    return(
        <div
          onClick ={()=> key === selected ? setSelected(""):setSelected(key)}
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