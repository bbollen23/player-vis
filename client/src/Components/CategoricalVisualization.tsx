import { useEffect, useRef} from 'react';
import * as d3 from 'd3';
import { CategoricalVisualizationInput,Data,Player } from '../types';



export default function CategoricalVisualization({players,selectedPlayer,attribute,ordered=false,nbins=-1}:CategoricalVisualizationInput){

  interface CatUnorderedData extends Data{
    value:number
  }

  interface CatOrderedData extends CatUnorderedData {
    x0:number,
    x1:number
  }

  // Data can contain either the unordered Categorical data or the ordered categorical data
  var data:Array<CatOrderedData|CatUnorderedData> = []

  if(ordered===false){
      // Group set of players by the values of the current attributes. 
      let groupedData = d3.group(players,d => d[attribute])
      // Map the resulting iterator to objects whose 'name' is the attirbute value and whose 'value' is the number of players
      data = d3.map(groupedData,d=>{
        return {
          // Assert d[0] as string since attribute is a string and these are how they are grouped.
          'name':d[0] as string,
          'value':d[1].length
        } 
      })
      // Sort data based on the number of elements in the bin. As a second key, sort by name. Without this, whenever we sort a column in the table view, the ordering will change in the dataset as well (up to equal values).
      data = data.sort((a,b)=>{
        return d3.descending(a.value,b.value) || d3.ascending(a.name,b.name)
      })
    }else {

      // Bin the data
      //Note -- this 'toString' method is called to avoid the Categorical visualizations that have an order to their keys but their values are already numbers.
      let binnedData:d3.Bin<Player,number>[];

      if(nbins === -1){
        binnedData = d3.bin<Player,number>().value((d)=>parseInt(d[attribute].toString().replace(/\D/g,'')))(players);
      } else {
        binnedData = d3.bin<Player,number>().thresholds(nbins).value((d)=>parseInt(d[attribute].toString().replace(/\D/g,'')))(players);
      }

      // Map the data to the same formatting as the non-ordered datasets
      data = binnedData.map((d,i) => {
        //Accounts for inclusion on the last bin
        let name = '';
        // Binned data may have undefined -- need to verify they exist
        if(d.x0 && d.x1){
          if(d.x0 === d.x1-1){
            name = d.x0.toString()
          } else {
            if(i === data.length-1){
              name = d.x0.toString()+'-'+d.x1.toString()
            } else {
              name = d.x0.toString()+'-'+(d.x1-1).toString()
            }
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
  const barHeight = d3.min([height/data.length-gap,10]) ?? 10;
  const x = d3.scaleLinear()
    .domain([0,d3.max(data,d => d.value) ?? 0])
    .range([marginLeft, (width - marginRight)]);


  const y = d3.scalePoint()
      .domain(d3.map(data,d=>d.name))
      .range([marginTop, height]).padding(0.5);

  // Handles possible undefined y values (i.e. name not being in domain)
  const y_transform = (name:string):number=>{
    const y_value = y(name);
    if(y_value){
      return y_value;
    }
    return 0
  }

  const gx = useRef<SVGGElement>(null);
  const gy = useRef<SVGGElement>(null);

  useEffect(()=>{
    if(gx.current){
      d3.select(gx.current).call(d3.axisTop(x).ticks(width / 80))
    }
  },[gx,x])

  useEffect(()=> {
    if(gy.current){
      d3.select(gy.current).call(d3.axisLeft(y).tickSizeOuter(0))
    }
  },[gy,y])

  // Used to determine if the current selected player falls within this particular band. 
  const determineSelected = (d:CatOrderedData|CatUnorderedData) => {
    if(selectedPlayer){
      if('x0' in d && 'x1' in d){
        // Using CatOrderedData
        if(parseInt(selectedPlayer[attribute].toString().replace(/\D/g,'')) < d.x1 && parseInt(selectedPlayer[attribute].toString().replace(/\D/g,'')) >= d.x0){
          return true
        } else {
          return false
        }  
      } else {
        //Using CatUnorderedData
        return selectedPlayer[attribute]===d.name
      }
    }
    return false
  }
  return(
      <svg 
        key={attribute}
        width={width}
        height={height+marginBottom}
        style={{maxWidth:600}}
      >        
      {data.map((d,i)=>
      <g key={i} fill={determineSelected(d) ? '#fc8d59':'steelblue'}>
        <rect 
          stroke="black"
          strokeWidth={determineSelected(d) ? 1 : 0}
          x={x(0)}
          y={y_transform(d.name)-(barHeight/2)}
          width={x(d.value)-x(0)}
          height={barHeight}/>
        </g>)}
        
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