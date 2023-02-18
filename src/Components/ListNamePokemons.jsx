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
    name:'',
  }

  componentDidMount(){
    const { first,pokemons,name } = this.props.location.state.gen
    this.setState({
      min:first,
      limit: pokemons,
      name:name,
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
    const {listPokemons,loading,name} = this.state
    if(loading){return <Loading/>}
    return (
      <div>
        <Header/>
        <div className='allPokemons'>
        <div className='headerText textDescriptions'>
                <h1>{name.toLocaleUpperCase()}</h1>
            </div>
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
