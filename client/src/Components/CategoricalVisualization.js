import { useEffect, useState,useRef} from 'react';
import * as d3 from 'd3';



export default function CategoricalVisualization({players,selectedPlayer,attribute,ordered=false,nbins=null}){




  var data =[]
  if(ordered===false){
      // Group set of players by the values of the current attributes. 

      data = d3.group(players,d => d[attribute])
      // Map the resulting iterator to objects whose 'name' is the attirbute value and whose 'value' is the number of players
      data = d3.map(data,d=>{
        return {
          'name':d[0],
          'value':d[1].length}
      })
      // Sort data based on the number of elements in the bin. As a second key, sort by name. Without this, whenever we sort a column in the table view, the ordering will change in the dataset as well (up to equal values).
      data = data.sort((a,b)=>{
        return d3.descending(a.value,b.value) || d3.ascending(a.name,b.name)
      })
    }else {
      // Bin the data
      //Note -- this 'toString' method is called to avoid the Categorical visualizations that have an order to their keys but their values are already numbers.
      console.log(attribute,nbins)
      if(nbins === null){
        data = d3.bin().value((d)=>parseInt(d[attribute].toString().replace(/\D/g,'')))(players);
      } else {
        data = d3.bin().thresholds(nbins).value((d)=>parseInt(d[attribute].toString().replace(/\D/g,'')))(players);

      }
      // Map the data to the same formatting as the non-ordered datasets
      data = data.map((d,i) => {
        //Accounts for inclusion on the last bin
        let name = ''
        if(d.x0 === d.x1-1){
          name = d.x0.toString()
        } else {
          if(i === data.length-1){
            name = d.x0.toString()+'-'+d.x1.toString()
          } else {
            name = d.x0.toString()+'-'+(d.x1-1).toString()
          }
        }

        return {
          'name':name,
          'value':d.length,
          'x0':d.x0,
          'x1':d.x1
        }
      })
      //Sort the data based on the name of the bin
      data = d3.reverse(d3.sort(data,d=>d.name))
  }


  const width = 350;
  const height = 250;
  const marginTop = 60;
  const marginRight = 10;
  const marginBottom = 20;
  const marginLeft = 130;
  const gap = 4;
  const barHeight = d3.min([height/data.length-gap,10])
  
  const x = d3.scaleLinear()
    .domain([0,d3.max(data,d => d.value)])
    .range([marginLeft, (width - marginRight)]);


  const y = d3.scalePoint()
      .domain(d3.map(data,d=>d.name))
      .range([marginTop, height]).padding(0.5);


  const gx = useRef();
  const gy = useRef();
  useEffect(()=>void d3.select(gx.current).call(d3.axisTop(x).ticks(width / 80)),[gx,x])

  useEffect(()=> void d3.select(gy.current).call(d3.axisLeft(y).tickSizeOuter(0)),[gy,y])

  const determineSelected = d => {
    if(Object.keys(selectedPlayer).length !== 0){
      if(ordered===true){
        if(selectedPlayer[attribute].toString().replace(/\D/g,'') < d.x1 && selectedPlayer[attribute].toString().replace(/\D/g,'') >= d.x0){
          return true
        } else {
          return false
        }
      } else {
        return selectedPlayer[attribute]===d.name
      }
    }
    return false
  }
  return(
      <svg 
        width={width}
        height={height+marginBottom}
        style={{maxWidth:600}}
      >        
      {data.map((d,i)=><g fill={determineSelected(d) ? '#fc8d59':'steelblue'}><rect stroke="black" stroke-width={determineSelected(d) ? 1 : 0} x={x(0)} y={y(d.name)-(barHeight/2)} width={x(d.value)-x(0)} height={barHeight}/></g>)}
        <g ref={gx} transform={`translate(0,${marginTop})`}></g>
        <g ref={gy} transform={`translate(${marginLeft},0)`}></g>
        <text 
          x={-marginTop-(height/2)-(attribute.length*2)}
          y={30}
          textAnchor='start'
          transform='rotate(-90)'
          className='axis-label'>{attribute.replace('_',' ')}</text>
        <text 
          x={width/2+40}
          y={30}
          textAnchor='start'
          className='axis-label'
        >
          Count
        </text>
      </svg>
  )

}