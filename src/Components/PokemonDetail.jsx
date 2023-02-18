import React, { Component } from 'react'
import { getPokemon ,setInfo } from '../Services/getPokemons'
import Header from './Header'


export default class PokemonDetail extends Component {
  state = {
    name: '',
    sprite: '',
    abilities: [],
    descriptionAbilities: [],
    height: '',
    weight: '',
    types: [],
    stats: [],
    imgType: '',
    description: [],
    habitat: '',
    api:''
  }
  componentDidMount() {
    this.dataPokemon()
   
  }

  dataPokemon = async () => {
    const { id } = this.props.match.params
    const data = await getPokemon(id);
    const api = await fetch(data.species.url)
    const dataSpecies = await api.json()
    const flavor_text_entries = dataSpecies.flavor_text_entries;
    const find = flavor_text_entries.map((e, index) => (e.language.name === 'en' && index % 2 === 1 && index < 8 ? e.flavor_text : false))
    const textDescriptions = find.filter((e) => (e !== false))
    const hab = setInfo(dataSpecies,'grassland',['habitat','name'])
    const spr = setInfo(data.sprites,data.sprites.front_default,['versions','generation-v','black-white','animated','front_default'])
    this.setState({
      name: data.name,
      sprite: spr,
      abilities: data.abilities,
      height: (data.height / 10),
      weight: (data.weight / 10),
      types: data.types,
      stats: data.stats,
      description: textDescriptions,
      habitat: hab,
      api:data,
    }, () => {
      this.abilityDescription()
      const favorites = JSON.parse(
        localStorage.getItem('favorites'),
      ) || [];
      if(favorites.some((e)=>(e.name===data.name))){
        const button = document.querySelector('#favoriteB')
        button.classList.add('favoriteSelected')
      }
    })
  }
  favoritePokemon = ({target}) =>{
    const{api,name} = this.state
    const favorites = JSON.parse(
      localStorage.getItem('favorites'),
    ) || [];
    let newFavorites = []
    if(!favorites.some((e)=>(e.name===name))){
      newFavorites = [...favorites,api]
      target.classList.add('favoriteSelected')
    }else{
      newFavorites = favorites.filter((e)=>(e.name !== name))
      target.classList.remove('favoriteSelected')
    }
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  }

  abilityDescription = () => {
    const { abilities } = this.state;
    let newDescription = []
    abilities.map(async (e) => {
      const name = e.ability.name;
      const url = e.ability.url;
      const api = await fetch(url);
      const data = await api.json();
      let description = []
      let a = 0
      if(data['effect_entries'].length === 0){
        description = data['flavor_text_entries'].map((e) => {
          if(a === 0){
            if(e.language.name === 'en'){
              a = 1
              return e.flavor_text
            }
          }
        })
      }else{
        description = data['effect_entries'].map((e) => {
          if(a ===0){
            if(e.language.name === 'en'){
              a = 1
              return e.effect
            }
          }
        })
      }
      const obj = {
        name: name,
        description: description,
        hide: e.is_hidden,
      };
      newDescription.push(obj);
      this.setState({
        descriptionAbilities: newDescription,
      })
    })
  }
  render() {
    const { name, sprite, descriptionAbilities, height, weight, types, stats, description, habitat } = this.state
    return (
      <div>
        <Header />
        <div className='pokeCard'>
          <div className='pokeCardHeader textStyled'>
            <h1 className='pokeName'>{name.toLocaleUpperCase()}</h1>
            <div className='pokeCardHeader'>
              {types.map((e, index) => (
                <div key={index}>
                  <div className='pokeType background' style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL + `/types/${e.type.name}.png`})`
                  }}></div>
                </div>
              ))}
            </div>

          </div>
          <div className='pokeBackground' style={{
            backgroundImage: `url(${process.env.PUBLIC_URL + `/habitats/${habitat}.png`})`
          }}>
            <div>
              <button className='favoriteButton' id='favoriteB' onClick={this.favoritePokemon}></button>
            </div>
            <img src={sprite} alt={name} className='pokeImgInCard' ></img>
          </div>
          <div className='pokeCardHeader textDescriptions'>
            <h3 className='pokeAttr'>height {height}m</h3>
            <h3 className='pokeAttr'>weight {weight}kg</h3>
          </div>
        </div>
        <div className='pokeDescriptions textDescriptions containerDescriptions'>
          <h1>{name.toLocaleUpperCase()}</h1>
          <h2>Type {types.map((e)=>(` ${e.type.name}`))}</h2>
          {description.map((e, index) => (
            <div key={index}>
              <h4>{e}</h4>
            </div>
          ))}
        </div>
        <div className='pokeAbilities textDescriptions'>
        {descriptionAbilities.map((e) => (
          <div key={e.name}>
            <h1>{e.name} {e.hide ? ' hide ability' : ''}</h1>
            <h2>{e.description}</h2>
          </div>
        ))}
        </div>
        <div className='pokeStats textDescriptions'>
        {stats.map((e) => (
          <div key={e.stat.name} className='borderBlack'>
            <h3>{e.stat.name} {e.base_stat}</h3>
          </div>
        ))}
        </div>
      </div>
    )
  }
}
