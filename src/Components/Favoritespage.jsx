import React, { Component } from 'react'
import Header from './Header'
import { Link } from 'react-router-dom';

export default class Favoritespage extends Component {
    state = {
        favorites :[]
    }
    componentDidMount(){
        this.getFavorite();
    }
    getFavorite = ()  =>{
    const arr =JSON.parse(
        localStorage.getItem('favorites'),
      ) || [];
    this.setState({
        favorites:arr
    })
  }
  render() {
    const {favorites} = this.state
    return (
      <div>
        <Header/>
        <div className='allPokemons'>
            <div className='headerText textDescriptions'>
                <h1>Favorites</h1>
            </div>
        {favorites.map((e,index)=>(
        <div key={index} ><Link className='links textDescriptions pokemonlist' to={`/pokemon/${e.id}`}>
          <div>
            <h4 className='pokemonlistText'>{e.id}.{e.name}</h4>
            <img src={e.sprites.front_default} alt={e.name} className='pokeImgHome'/>
          </div>
        </Link>
        </div>
      ))}
        </div>
      </div>
    )
  }
}
