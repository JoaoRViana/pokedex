import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePage from './Components/HomePage';
import ListNamePokemons from './Components/ListNamePokemons';
import PokemonDetail from './Components/PokemonDetail';
import Favoritespage from './Components/Favoritespage';
import notFound from './Components/notFound';

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
                path="/generations/:name"
                render={ (props) => <ListNamePokemons { ...props } /> }
              />
               <Route  path="/favorites" component={ Favoritespage } />
               <Route  path="/notfound" component={ notFound } />
              <Route exact path="/" component={ HomePage } />
              <Route path="*" component = {notFound} />
          </Switch>
      </div>
    );
  }
}

export default Routes;
