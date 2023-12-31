import { useEffect, useRef} from 'react';
import * as d3 from 'd3';



export default function NumericalVisualization({players,headers,selectedPlayer}){

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
  const currentNumericalKeys = numericalKeys.filter(entry => headers.includes(entry))

  // Set domain to 1 to 100 (with 1 being the lowest rating and 100 being the highest)
  const domain = Array(100).fill(1).map((n,i)=>i+1)
  //Prepare series as a set of key-value pairs where the keys are the name of the attribute and the values is a histogram counting the number of users with those ratings
  var series = []
  currentNumericalKeys.forEach(key => {
    let tempValues = new Array(100).fill(0)
    players.forEach(player => {
      let rating = player[key]
      tempValues[rating] = tempValues[rating]+1
    })
    // Keeps track of the maximum Z value for use in the Z-axis range.
    series.push({'name':key,values:tempValues})
  })


  const width = 600;
  const chart_height = 50;
  // If the height tries to pass 675, bound it to keep the view non-scrollable.
  const height = series.length === 0 ? 500 : d3.min([chart_height*series.length,675])
  const marginTop = 50;
  const marginRight = 80;
  const marginBottom = 80;
  const marginLeft = 120;

  // Controls the x-scale
  const x = d3.scaleLinear()
    .domain(d3.extent(domain))
    .range([marginLeft, width - marginRight]);

  // The y scale controls the scale of the entire view (i.e. where each chart appears)
  const y = d3.scalePoint()
      .domain(series.map(d => d.name))
      .range([marginTop, height]);

  // The z scale controls the curve and line for each individual chart
  const z = d3.scaleLinear()
      .domain([0, 10]).nice()
      .range([0, -40]);

  // Create the area generator and its top-line generator.
  const area = d3.area(d=>d)
      // .curve(d3.curveBasis)
      .x((d, i) => x(domain[i]))
      .y0(0)
      .y1(d => z(d));

  //Generate the line function for the curve to add boldness to the area (added as a separate path)
  const line = area.lineY1();

  const gx = useRef();
  const gy = useRef();

  useEffect(()=>void d3.select(gx.current).call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0)),[gx,x])

  useEffect(()=> void d3.select(gy.current).call(d3.axisLeft(y).tickSize(0).tickPadding(4)).attr('font-size','10px').call(g=>g.select('domain')),[gy,y])

  // If there is only one numerical attribute, the y-value will default to the min, instead of the max of the range. To alleviate this, we add in a y-transform function.
  const y_transform = name => {
    if(series.length === 1){
      return series.length*chart_height
    } else {
      return y(name)
    }
  }

  const playerLine = d3.line(
    (d,i)=>x(selectedPlayer[d.name]+1),
    (d,i)=>z(d.values[selectedPlayer[d.name]])+y_transform(d.name))

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
            <g transform={`translate(0,${y_transform(data.name)})`}>
            <path fill='steelblue' d={area(data.values)}/>
            <path fill="none" stroke="black" d={line(data.values)}/>
            </g>
          )}
        </g>
        {/* Generate the path individual circles and the path connecting them. */}
        {Object.keys(selectedPlayer.length!==0) ?
          <path 
            d={playerLine(series)}
            fill='none'
            stroke='#fc8d59'
            strokeWidth={2.5}
          />:<></>}
        {series.map(data => <g transform={`translate(0,${y_transform(data.name)})`}>
            {Object.keys(selectedPlayer).length!==0 ?
              <circle
                cx={x(selectedPlayer[data.name]+1)}
                cy={z(data.values[selectedPlayer[data.name]])}
                r={5}
                fill='#fc8d59'
                stroke='black'
                stroke-width={1}
              />:<></>}
          </g>)}


        {currentNumericalKeys.length === 0 ? <text fill='#6c6c6c' x={(width/2)-(no_numerical_keys_text.length*4)} y={height/2+marginTop}>{no_numerical_keys_text}</text>:<></>}
      </svg>
  )

}