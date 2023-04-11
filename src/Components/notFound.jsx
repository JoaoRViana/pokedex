import React, { Component } from 'react'
import Header from './Header'

export default class notFound extends Component {
  render() {
    return (
      <div>
        <Header />
        <div className='allPokemons'>
                <h1 className='headerText textDescriptions titleWhite'>Missing Nº</h1>
                <div className='notFound'>
            </div>
        </div>
      </div>
    )
  }
}
