import React, { Component } from 'react'
import Header from './Header'

export default class notFound extends Component {
  render() {
    return (
      <div>
        <Header />
        <div className='allPokemons'>
            <div className='textDescriptions'>
                <h1>Pokemon not found</h1>
                <div className='notFound'>
                </div>
            </div>
        </div>
      </div>
    )
  }
}