import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePage from './Components/HomePage';
import ListNamePokemons from './Components/ListNamePokemons';
import PokemonDetail from './Components/PokemonDetail';

class Routes extends Component {
  render() {
    return (
      <div>

          <Switch>
            <Route
                path="/pokemon/:id"
                render={ (props) => <PokemonDetail { ...props } /> }
              />
               <Route
                path="/generations/:first"
                render={ (props) => <ListNamePokemons { ...props } /> }
              />
              <Route exact path="/" component={ HomePage } />
          </Switch>
      </div>
    );
  }
}

export default Routes;
