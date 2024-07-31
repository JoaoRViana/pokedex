
export const getPokemonsGen = async(id)=>{
  const data = await (await fetch(`https://pokeapi.co/api/v2/generation/${id}/`)).json()
  return data
}

export const getPokemon = async(id)=>{
  const api = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
  const data = await api.json()
  return data;
}

export const getGenerations = async ()=>{
  const api = await fetch('https://pokeapi.co/api/v2/generation/');
  const data = await api.json();
  return data
}

export const setInfo = (data,def,arr) =>{
  let newInfo = def;
  try {
    let newData = data
    for(let i =0;i<arr.length;i++){
      newData = newData[arr[i]]
    }
    newInfo = newData
    if(newInfo === null){
      newInfo = def
    }
  } catch (error) {
    newInfo = def
  }
  return newInfo
}
