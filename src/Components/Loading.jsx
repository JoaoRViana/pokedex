import React, { Component } from 'react'
import Header from './Header'

export default class Loading extends Component {
  render() {
    return (
      <div>
        <div>
          <Header/>
        </div>
        <div className='allPokemons'>
          <div className='loadingComponent textDescriptions'>
          <h2>Loading...</h2>
          <div className='loading'>
          </div>
        </div>
      </div>
      </div>
      
    )
  }
}
