import React, { Component } from 'react'
import Header from './Header'
import ListGenerations from './ListGenerations'
import ListNamePokemons from './ListNamePokemons'

export default class HomePage extends Component {
  render() {
    return (
      <div>
        <div>
          <Header />
          <ListGenerations/>
        </div>
      </div>
    )
  }
}
