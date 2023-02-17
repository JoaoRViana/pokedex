import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { getSomePokemons } from '../Services/getPokemons'
import Header from './Header'
import Loading from './Loading'

export default class ListNamePokemons extends Component {
  state = {
    listPokemons:[],
    min:0,
    limit:42,
    loading:false,
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
    this.setState({
      loading:true,
    })
    const pokemons = await getSomePokemons(min,limit)
    this.setState({
      listPokemons:pokemons,
      loading:false,
    })
  }
  render() {
    const {listPokemons,loading} = this.state
    let load;
    if(loading){load = <Loading/>}
    return (
      <div>
        <Header/>
        <div className='allPokemons'>
        {load}
        {listPokemons.map((e,index)=>(
        <div key={index} ><Link className='links textDescriptions pokemonlist' to={`/pokemon/${e.pokedexNumber}`}>
          <div>
            <h4 className='pokemonlistText'>{e.pokedexNumber}.{e.name}</h4>
            <img src={e.sprite} alt={e.name} className='pokeImgHome'/>
          </div>
        </Link>
        </div>
      ))}
      </div>
      </div>
    )
  }
}
