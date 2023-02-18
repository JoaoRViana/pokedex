import React, { Component } from 'react'
import Header from './Header'
import { getPokemon ,setInfo } from '../Services/getPokemons'
import { Redirect } from 'react-router-dom'
import Loading from './Loading'


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
    api:'',
    notFound:false,
    loading:true
  }
  componentDidMount() {
    this.dataPokemon()
  }

  dataPokemon = async () => {
    const { id } = this.props.match.params
    let data;
    try {
      data = await getPokemon(id);

    } catch (error) {
      this.notFound();
    }
    const api = await fetch(data.species.url)
    const dataSpecies = await api.json()
    const flavor_text_entries = dataSpecies.flavor_text_entries;
    const find = flavor_text_entries.map((e, index) => (e.language.name === 'en' && index % 3 === 1 && index < 10 ? e.flavor_text : false))
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
      pokemonInfos:data,
    }, () => {
      this.abilityDescription()
    })
  }
  favoriteInLocalStorage = (data)=>{
    const favorites = JSON.parse(
      localStorage.getItem('favorites'),
    ) || [];
    if(favorites.some((e)=>(e.name===data.name))){
      const button = document.querySelector('#favoriteB')
      button.classList.add('favoriteSelected')
    }
  }
  favoritePokemon = ({target}) =>{
    const{pokemonInfos,name} = this.state
    const favorites = JSON.parse(
      localStorage.getItem('favorites'),
    ) || [];
    let newFavorites = []
    if(!favorites.some((e)=>(e.name===name))){
      newFavorites = [...favorites,pokemonInfos]
      target.classList.add('favoriteSelected')
    }else{
      newFavorites = favorites.filter((e)=>(e.name !== name))
      target.classList.remove('favoriteSelected')
    }
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  }
  notFound = () =>{
    this.setState({
      loading:false,
      notFound:true,
    })
  }
  abilityDescription = () => {
    const { abilities,pokemonInfos } = this.state;
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
        loading:false
      },()=>{
        this.favoriteInLocalStorage(pokemonInfos);
      })
    })
  }
  render() {
    const { name, sprite, descriptionAbilities, height, weight, types, stats, description, habitat,notFound,loading } = this.state
    if(loading){return(
      <Loading />
    )}
    if(notFound){return <Redirect to='/notfound'/>}
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
