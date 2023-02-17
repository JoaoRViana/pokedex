import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { getSomePokemons } from '../Services/getPokemons'
import Header from './Header'

export default class ListNamePokemons extends Component {
  state = {
    listPokemons:[],
    min:0,
    limit:42,
  }

  componentDidMount(){
    const { first,pokemons } = this.props.location.state.gen
    this.setState({
      min:first,
      limit: pokemons,
    },()=>{
      this.listing()
    })
  }
  listing = async () =>{
    const{min,limit} = this.state;
    const pokemons = await getSomePokemons(min,limit)
    this.setState({
      listPokemons:pokemons
    })
  }
  render() {
    const {listPokemons} = this.state
    return (
      <div>
        <Header/>
        <div className='allPokemons'>
        {listPokemons.map((e,index)=>(
        <div key={index} className='pokemonlist'><Link to={`/pokemon/${e.pokedexNumber}`}>
          <h4>{e.pokedexNumber}.{e.name}</h4>
          <img src={e.sprite} alt={e.name} className='pokeImgHome'/>
        </Link>
        </div>
      ))}
      </div>
      </div>
      
    )
  }
}
