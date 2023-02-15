
const getSomePokemons = async(first,last) =>{
  const api =  await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${first}&limit=${last}`)
  const data = await api.json()
  let arrPokemons = data.results
  const somePokemons = []
  for(let i = first;i<last;i++){
    const api = await fetch(arrPokemons[i].url)
    const data = await api.json()    
    const obj = {
      name:data.name,
      sprite:data.sprites['front_default'],
    }
    somePokemons.push(obj)
  }
  return somePokemons
}

export default getSomePokemons;