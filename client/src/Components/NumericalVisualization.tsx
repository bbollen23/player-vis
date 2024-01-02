import { FC, useEffect, useRef} from 'react';
import * as d3 from 'd3';
import { NumericalVisualizationInput,Data} from '../types';



export default function NumericalVisualization({currentNumericalAttributes,players,selectedPlayer=null}:NumericalVisualizationInput){

  interface NumericalData extends Data{
    values:number[]
  }

  // Set domain to 1 to 100 (with 1 being the lowest rating and 100 being the highest)
  const domain = Array(100).fill(1).map((n,i)=>i+1)
  //Prepare series as a set of key-value pairs where the keys are the name of the attribute and the values is a histogram counting the number of users with those ratings
  var series:Array<NumericalData> = []
  if(players !== null){
    currentNumericalAttributes.forEach(key => {
      let tempValues = new Array(100).fill(0)
      players.forEach(player => {
        //Assert that the player[key] is a number in this case.
        let rating:number = player[key] as number;
        tempValues[rating] = tempValues[rating]+1
      })
      // Keeps track of the maximum Z value for use in the Z-axis range.
      series.push({'name':key,values:tempValues})
    })  
  }


  const width = 600;
  const chart_height = 50;
  // If the height tries to pass 675, bound it to keep the view non-scrollable.
  const height = series.length === 0 ? 500 : d3.min([chart_height*series.length,675]) ?? 675;
  const marginTop = 50;
  const marginRight = 80;
  const marginBottom = 80;
  const marginLeft = 120;

  // Controls the x-scale
  const x = d3.scaleLinear()
    .domain([1,100])
    .range([marginLeft, width - marginRight]);

  // The y scale controls the scale of the entire view (i.e. where each chart appears)
  const y = d3.scalePoint()
      .domain(series.map(d => d.name))
      .range([marginTop, height]);

  // If there is only one numerical attribute, the y-value will default to the min, instead of the max of the range. To alleviate this, we add in a y-transform function.
  const y_transform = (name:string):number => {
    if(series.length === 1){
      return series.length*chart_height
    } else {
      const yValue = y(name);
      if(yValue){
        return yValue
      }
      return 0
    }
  }


  // The z scale controls the curve and line for each individual chart
  const z = d3.scaleLinear()
      .domain([0, 10]).nice()
      .range([0, -40]);

  function generateDistributionData(data:NumericalData):[string,string] | undefined {
      if(data.values){
        const area = d3.area<number>()
        .x((d,i)=>x(domain[i]))
        .y0(0)
        .y1((d) => z(d))

        const line = area.lineY1();

        let generatedArea = area(data.values)! //Assert that the generatedArea is defined
        let generatedLine = line(data.values)! //Assert generatedLine is defined
        return [generatedArea,generatedLine]
      } else {
        return undefined;
      }
  }


  const gx = useRef<SVGGElement>(null);
  const gy = useRef<SVGGElement>(null);

  // Set the X Axis
  useEffect(()=>{
    if(gx.current){
      d3.select(gx.current).call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
    }
  },[gx,x])

  // Set the Y Axis
  useEffect( () => {
    if(gy.current){
      d3.select(gy.current).call(d3.axisLeft(y).tickSize(0).tickPadding(4)).attr('font-size','10px').call(g=>g.select('domain'))
    }
  },[gy,y])



  // Line function to connect the individual points in the separated distributions.
  const playerLine:d3.Line<NumericalData> = d3.line(
    (d,i)=>selectedPlayer !== null ? (x(selectedPlayer[d.name] as number +1)) : 0,
    (d,i)=>{
      if(selectedPlayer !==null){
        let rating:number = selectedPlayer[d.name] as number;
        if(d.values){
          let dvalue = d.values[rating]
          return z(dvalue) + y_transform(d.name)   
        }
      }
      return  0
    })

  // It's easier to set this as a variable and then use it later so that we can use the character length to adjust it's positioning.
  const no_numerical_keys_text = 'There are currently no numerical attributes chosen.'
  
  return(
      <svg 
        width={width}
        height={height+marginBottom}
        style={{maxWidth:600}}
      >
        {/* Only show the axes when an additional attribute is provided */}
        {series.length !== 0 ? 
        <g
          ref={gx}
          transform={`translate(0,${height})`}
        >
          <text
            fill='black'
            x={width/2-5}
            y={40}
            textAnchor='start'
            className='axis-label'
            style={{fontSize:'12pt'}}
          >
            Score
          </text>
        </g>:<></>}
        {series.length !== 0 ? 
          <g
            ref={gy}
            font-size={20}
            transform={`translate(${marginLeft},0)`}
          >
            <text
              fill='black'
              y={-90}
              x={-((height+chart_height)/2)-25}
              className='axis-label'
              style={{fontSize:'12pt'}}
              transform={`rotate(-90)`}
              textAnchor='start'
              alignmentBaseline='middle'
            >
              Attribute
            </text>
          </g>: <></>}
        <g>
          {series.map(data => 
            
            {
              let distribution = generateDistributionData(data)
              if(distribution){
                return (
                  <g transform={`translate(0,${y_transform(data.name)})`}>
                    <path fill='steelblue' d={distribution[0]}/>
                    <path fill="none" stroke="black" d={distribution[1]}/>
                  </g>
                )    
              }
            }
          )}
        </g>
        {/* Generate the path individual circles and the path connecting them. */}
        {selectedPlayer !== null && series.length != 0?
          <path 
          // Casting playerLine(series) as string since the series.length must be non-zero and valid.
            d={playerLine(series) as string}
            fill='none'
            stroke='#fc8d59'
            strokeWidth={2.5}
          />:<></>}
        {series.map(data => <g transform={`translate(0,${y_transform(data.name)})`}>
            {selectedPlayer !== null &&  data.values ?
              <circle
                cx={x(selectedPlayer[data.name] as number +1)}
                cy={z(data.values[selectedPlayer[data.name] as number])}
                r={5}
                fill='#fc8d59'
                stroke='black'
                strokeWidth={1}
              />:<></>}
          </g>)}


        {currentNumericalAttributes.length === 0 ? <text fill='#6c6c6c' x={(width/2)-(no_numerical_keys_text.length*4)} y={height/2+marginTop}>{no_numerical_keys_text}</text>:<></>}
      </svg>
  )

}