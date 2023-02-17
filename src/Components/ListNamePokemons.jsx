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
    const { first } = this.props.match.params
    this.setState({
      min:first
    },()=>{
      this.listing()
    })
  }
  changePage = ({target}) =>{
    const {min} = this.state;
    const newmin = +(min) + +(target.value)
    if(newmin>=0){
      this.setState({
        min: newmin,
      },()=>{
        this.listing()
      })
    }
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
        <button onClick={this.changePage} value={+42}>NextPage</button>
        <button onClick={this.changePage} value={-42}>PreviousPage</button>
      </div>
      
    )
  }
}
