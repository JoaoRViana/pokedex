import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { getSomePokemons } from '../Services/getPokemons'

export default class ListNamePokemons extends Component {
  state = {
    listPokemons:[],
    min:0,
    max:42,
  }

  componentDidMount(){
    this.listing()
  }
  changePage = ({target}) =>{
    const {min,max} = this.state;
    const newmin = +(min) + +(target.value)
    const newmax = +(max) + +(target.value)
    
    if(newmin>=0){
      this.setState({
        min: newmin,
        max: newmax,
      },()=>{
        this.listing()
      })
    }
  }
  listing = async () =>{
    const{min,max} = this.state;
    const pokemons = await getSomePokemons(min,max)
    this.setState({
      listPokemons:pokemons
    })
  }
  render() {
    const {listPokemons} = this.state
    return (
      <div className='allPokemons'>
        {listPokemons.map((e,index)=>(
        <div key={index} className='pokemonlist'><Link to={`/pokemon/${e.pokedexNumber}`}>
          <h4>{e.pokedexNumber}.{e.name}</h4>
          <img src={e.sprite} alt={e.name} className='pokeImgHome'/>
        </Link>
          
        </div>
      ))}
      <button onClick={this.changePage} value={+42}>NextPage</button>
      <button onClick={this.changePage} value={-42}>PreviousPage</button>

      </div>
    )
  }
}
