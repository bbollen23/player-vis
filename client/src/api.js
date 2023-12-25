export async function fetchPlayers(){
  let url = process.env.REACT_APP_BASE_API_URL + "/players/"
  return await fetch(url).then(response => response.json())
}