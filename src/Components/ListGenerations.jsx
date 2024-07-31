import React, { Component } from 'react'
import { getGenerations,getPokemon } from '../Services/getPokemons'
import { Link } from 'react-router-dom'

export default class ListGenerations extends Component {
    state = {
        generations : [],
        randomPokemon:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/132.gif",
        randomPokemon2:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/132.gif",
    }
    componentDidMount(){
        this.getGens()
        this.getRandomPokemon();
        setInterval(()=>{
            this.getRandomPokemon();
        },3000)
    }
    getGens = async() =>{
        let data = (await getGenerations()).results
        let arr = await Promise.all(data.map(async (e) => {
            const data = await (await fetch(e.url)).json();
            const obj = {
                id:data.id,
                name:data.main_region.name,
                quantity:data.pokemon_species.length,
            };
            return obj;
        }));
        this.setState({
            generations:arr,
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
                    pathname: `/generations/${generations[index].id}`,
                    state: { gen: generations[index] } } }
                    ><div>
                        <h3>{index +1}ª Gen</h3>
                        <h1 className='titleGray'>{e.name.toLocaleUpperCase()}</h1>
                        <h3>{e.quantity} Pokemons</h3>
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
