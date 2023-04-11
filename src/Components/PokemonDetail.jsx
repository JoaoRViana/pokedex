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
    loading:true,
    id:'',
    divIndex:0,
    div:'',
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
    const find = flavor_text_entries.map((e, index) => (e.language.name === 'en' && index % 3 === 1 && index < 10 ? e.flavor_text.replaceAll('\f',' ') : false))
    const textDescriptions = find.filter((e) => (e !== false))
    const hab = setInfo(dataSpecies,'grassland',['habitat','name'])
    const spr = setInfo(data.sprites,data.sprites.other['official-artwork'].front_default,['versions','generation-v','black-white','animated','front_default'])
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
      id:data.id,
    }, () => {
      this.abilityDescription()
      this.setState({
        div:this.divPokemonDescription(),
      })
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
  shinyPokemon = ({target})=>{
    const{pokemonInfos} = this.state
    let spr =''
    if(target.classList.value.includes('shinySelected')){
      target.classList.remove('shinySelected')
      spr = setInfo(pokemonInfos.sprites,pokemonInfos.sprites.other['official-artwork'].front_default,['versions','generation-v','black-white','animated','front_default'])

    }else{
      target.classList.add('shinySelected')
      spr = setInfo(pokemonInfos.sprites,pokemonInfos.sprites.other['official-artwork'].front_shiny,['versions','generation-v','black-white','animated','front_shiny'])
    }
    this.setState({
      sprite: spr,
    })
  }
  notFound = () =>{
    this.setState({
      loading:false,
      notFound:true,
    })
  }
  anotherPokemon = ({target}) =>{
    const {id} = this.state;
    const {history} = this.props
    history.push(`/pokemon/${(id)+(+(target.value))}`)
    document.location.reload()
  }
  abilityEffect = (data) =>{
    let description = []
    if(data['effect_entries'].length === 0){
      description = data['flavor_text_entries'].map((e) => {
          if(e.language.name === 'en'){
            return e.flavor_text.replaceAll('\f',' ')
          }return false
        }
      )
    }else{
      description = data['effect_entries'].map((e) => {
          if(e.language.name === 'en'){
            return e.effect.replaceAll('\f',' ')
          }return false
        }
      )
    }
    return description
  }
  abilityDescription = () => {
    const { abilities,pokemonInfos } = this.state;
    let newDescription = []
    abilities.map(async (e) => {
      const name = e.ability.name;
      const url = e.ability.url;
      const api = await fetch(url);
      const data = await api.json();
      const description = this.abilityEffect(data)
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
  divPokemonDescription =()=>{
    const {name,types,description} = this.state;
    return (<div className='pokeDescriptions textDescriptions containerDescriptions'>
    <h1 className='titleGray titleName'>{name.toLocaleUpperCase()}</h1>
    <h2 >Type :{types.map((e)=>(` ${e.type.name}`))}</h2>
    {description.map((e, index) => (
      <div key={index}>
        <h4>{e}</h4>
      </div>
    ))}
  </div>)
  }
  divPokemonAbillities = () =>{
    const {descriptionAbilities} = this.state;
    return (<div className='pokeAbilities textDescriptions containerDescriptions'>
      <h1 className='titleGray'>Abillities</h1>
    {descriptionAbilities.map((e,index) => (
      <div key={`${e.name}${index}`}>
        <h2 className={e.hide?'hideAbility':''}>{e.name} {e.hide?'Hide Ability':''}</h2>
        <h3 className={e.hide?'hideAbility':''}>{e.description}</h3>
      </div>
    ))}
    </div>)
  }
  divPokemonStats = () =>{
    const { stats} = this.state;
    return (
      <div className='pokeStats textDescriptions containerDescriptions'>
        <h1 className='titleGray'>Stats</h1>
      {stats.map((e) => (
        <div key={e.stat.name}>
          <h3 className='textStats'>{e.stat.name.toLocaleUpperCase()} : {e.base_stat}</h3>
        </div>
      ))}
      </div>
    )
  }
  nextDivText=({target})=>{
    const { divIndex} = this.state;
    const con = document.querySelector('#container')
    target.value>0?con.classList.add('textEffectRight'):con.classList.add('textEffectLeft');
    let next = +(divIndex) + (+(target.value))
    next = next>2?next=0:next;
    next = next<0?next=2:next;
    this.setState({
      divIndex:next,
    })
    if(next===2){
      next = this.divPokemonStats();
    }else if(next=== 1){
      next = this.divPokemonAbillities();
    }else{
      next = this.divPokemonDescription();
    }
    this.setState({
      div:next,
    })
    setTimeout(()=>{
      target.value>0?con.classList.remove('textEffectRight'):con.classList.remove('textEffectLeft');
    },500)
  }
  render() {
    const { name, sprite, height, weight, types, habitat,notFound,loading,id ,div } = this.state
    if(loading){return(
      <Loading />
    )}
    if(notFound){return <Redirect to='/notfound'/>}
    return (
      <div>
        <Header />
        <div className='pokeDetailsPage'>
          <div className='pokeContainerText '>
            <div>
            <button className=' textStyled highSize arrows' value={-1} onClick={this.nextDivText}> {'<'} </button>
            </div>
            <div id='container'>
              {div}
            </div>
            <div>
              <button className='textStyled highSize arrows' value={+1} onClick={this.nextDivText}> {'>'} </button>
            </div>
          </div>
          <div className='pokeCard'>
          <div className='pokeCardHeader textStyled'>
            <div className='pokeName'>
              <div className='pokeNumber'>
                <button className='textStyled mediumSize arrows' value={-1} onClick={this.anotherPokemon}> {'<--'} </button>
                <h3 >Nº{id}</h3>
                <button className='textStyled mediumSize arrows' value={+1} onClick={this.anotherPokemon}>{'-->'}</button>
              </div>
              <h2 className='textName'>{name.toLocaleUpperCase()}</h2>
            </div>
            <div className='pokeCardHeader'>
              {types.map((e, index) => (
                <div key={index}>
                  <div className='pokeType' style={{
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
              <button className='shinyButton' id='shinyB' onClick={this.shinyPokemon}></button>
            </div>
            <img src={sprite} alt={name} className='pokeImgInCard' ></img>
          </div>
          <div className='pokeCardHeader textDescriptions'>
            <div className='pokeAttrContainer'>
              <h3 className='pokeAttr'>height: {height}m</h3>
              <h3 className='pokeAttr'>weight: {weight}kg</h3>
            </div>
          </div>
        </div>
          </div>
      </div>
    )
  }
}
