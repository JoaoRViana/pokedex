import React, { Component } from 'react'
import { getGenerations,getPokemon } from '../Services/getPokemons'
import { Link } from 'react-router-dom'

export default class ListGenerations extends Component {
    state = {
        generations : [],
        randomPokemon:'',
        randomPokemon2:'',
    }
    componentDidMount(){
        this.getGens()
        this.getRandomPokemon();
        setInterval(()=>{
            this.getRandomPokemon();
        },3000)
    }
    getGens = async() =>{
        let data = await getGenerations()
        data = data.results;
        let arr = []
        let first = 0
        data.map(async (e)=>{
            const api = await fetch(e.url)
            const data = await api.json()
            console.log(data)
            const primeiro  = (data.pokemon_species[0].url).indexOf('pokemon-species')
            let allPokemons = (data.pokemon_species.map((e)=>(+((e.url.slice(primeiro).replace('pokemon-species',''))).replaceAll('/',''))))
            allPokemons = allPokemons.sort((a,b)=>(a-b))
            const firstPokemon = allPokemons[0]
            const obj = {
                name : data.main_region.name,
                pokemons: data.pokemon_species.length,
                first : (+firstPokemon-1)
            }
            first = data.pokemon_species.length + first
            arr.push(obj)
            arr = arr.sort((a,b)=>a.first-b.first)
            this.setState({
                generations:arr,
            })
        })
    }

    getRandomPokemon = async()=>{
        const randomNumber =  Math.round((Math.random()*649))
        const randomNumber2 =  Math.round((Math.random()*649))
        const pokemon = await getPokemon(randomNumber)
        const pokemon2 = await getPokemon(randomNumber2)
        this.setState({
            randomPokemon:pokemon.sprites.versions['generation-v']['black-white'].animated.back_default,
            randomPokemon2:pokemon2.sprites.versions['generation-v']['black-white'].animated.back_default

        })
    }
    
  render() {
    const {generations,randomPokemon,randomPokemon2} = this.state
    return (
      <div>
        <div className='listGenerations'>
            {generations.map((e,index)=>(
                <div key={e.name} className=''>
                    <Link className='links region textDescriptions' to={ {
                    pathname: `/generations/${generations[index].name}`,
                    state: { gen: generations[index] } } }
                    ><div>
                        <h1 className='titleGray'>{e.name.toLocaleUpperCase()}</h1>
                        <h3>{e.pokemons} Pokemons</h3>
                    </div>
                    </Link>
                </div>
            ))}
        </div>
        <div className='pokeImgInGenContainer'>
        <img src={randomPokemon} alt='pokemon aleatorio' className='pokeImgInGen'></img>
        <img src={randomPokemon2} alt='pokemon aleatorio' className='pokeImgInGen inverted'></img>

        </div>
      </div>
    )
  }
}
