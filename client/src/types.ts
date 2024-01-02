import {Dispatch,SetStateAction} from 'react';


export type Player = {
  "Name": string,
  "Nationality": string,
  "National_Position": string,
  "National_Kit": number,
  "Club": string,
  "Club_Position": string,
  "Club_Kit": number,
  "Club_Joining": string,
  "Contract_Expiry": number,
  "Rating": number,
  "Height": string,
  "Weight": string,
  "Preffered_Foot": string,
  "Birth_Date": string,
  "Age": number,
  "Preffered_Position": string,
  "Work_Rate": string,
  "Weak_foot": number,
  "Skill_Moves": number,
  "Ball_Control": number,
  "Dribbling": number,
  "Marking": number,
  "Sliding_Tackle": number,
  "Standing_Tackle":number,
  "Aggression":number,
  "Reactions":number,
  "Attacking_Position":number,
  "Interceptions":number,
  "Vision":number,
  "Composure":number,
  "Crossing":number,
  "Short_Pass":number,
  "Long_Pass":number,
  "Acceleration":number,
  "Speed":number,
  "Stamina":number,
  "Strength":number,
  "Balance":number,
  "Agility":number,
  "Jumping":number,
  "Heading":number,
  "Shot_Power":number,
  "Finishing":number,
  "Long_Shots":number,
  "Curve":number,
  "Freekick_Accuracy":number,
  "Penalties":number,
  "Volleys":number,
  "GK_Positioning":number,
  "GK_Diving":number,
  "GK_Kicking":number,
  "GK_Handling":number,
  "GK_Reflexes":number
} & {[key:string]:string|number}



export type NumericalVisualizationInput = {
  currentNumericalAttributes:Array<string>,
  players:Array<Player>,
  selectedPlayer:Player|null
}

export type PlayersTableInput = {
  players:Array<Player>,
  headers:Array<string>,
  staticPlayers:Array<Player>,
  selectedPlayer:Player|null,
  setPlayers:Dispatch<SetStateAction<Array<Player>|null>>,
  setHeaders:Dispatch<SetStateAction<Array<string>>>,
  setSelectedPlayer:Dispatch<SetStateAction<Player|null>>
}

export type CategoricalVisualizationInput = {
  players:Array<Player>,
  selectedPlayer:Player|null,
  attribute:string,
  ordered:boolean,
  nbins:number
}

export type AttributesModalInput = {
  attributes:Array<string>
  headers:Array<string>
  modal:boolean,
  showModal:Dispatch<SetStateAction<boolean>>,
  setHeaders:Dispatch<SetStateAction<Array<string>>>
}

// Used as an interface since we will extend this in each individual component accordingly
export interface Data {
  name:string
}

export type SortedColumn = {
  column:string,
  direction:string
} & {[key:string]:string}

