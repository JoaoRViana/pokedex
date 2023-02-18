import React, { Component } from 'react'
import { getGenerations } from '../Services/getPokemons'
import { Link } from 'react-router-dom'

export default class ListGenerations extends Component {
    state = {
        generations : [],
    }
    componentDidMount(){
        this.getGens()
    }
    getGens = async() =>{
        let data = await getGenerations()
        data= data.results;
        let arr = []
        let first = 0
        data.map(async (e)=>{
            const api = await fetch(e.url)
            const data = await api.json()
            const obj = {
                name : data.main_region.name,
                pokemons: data.pokemon_species.length,
                first : first
            }
            first = data.pokemon_species.length + first
            arr.push(obj)
            this.setState({
                generations:arr,
            })

        })
    }
  render() {
    const {generations} = this.state
    return (
      <div>
        <div className='listGenerations'>
            {generations.map((e,index)=>(
                <div key={e.name} className=''>
                    <Link className='links region textDescriptions' to={ {
                    pathname: `/generations/${index+1}`,
                    state: { gen: generations[index] } } }
                    ><div>
                        <h1>{e.name.toLocaleUpperCase()}</h1>
                        <h3>{e.pokemons} Pokemons</h3>
                    </div>
                    </Link>
                </div>
            ))}
        </div>
      </div>
    )
  }
}
