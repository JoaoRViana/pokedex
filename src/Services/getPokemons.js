
export const getSomePokemons = async(first,limit) =>{
  const api =  await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${first}&limit=${limit}`)
  const data = await api.json()
  let arrPokemons = data.results
  const somePokemons = []
  for(let i = 0;i<limit;i++){
    const api = await fetch(arrPokemons[i].url)
    const data = await api.json()
    const spr = setInfo(data.sprites,data.sprites.front_default,['versions','generation-vii','icons','front_default'])
    const obj = {
      name:data.name,
      sprite:spr,
      api: api,
      pokedexNumber:data.id,
    }
    somePokemons.push(obj)
  }
  return somePokemons
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
