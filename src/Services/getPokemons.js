
export const getSomePokemons = async(first,limit) =>{
  const api =  await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${first}&limit=${limit}`)
  const data = await api.json()
  let arrPokemons = data.results
  const somePokemons = []
  for(let i = 0;i<limit;i++){
    const api = await fetch(arrPokemons[i].url)
    const data = await api.json()
    const obj = {
      name:data.name,
      sprite:data.sprites.versions['generation-vii']['icons']['front_default'],
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