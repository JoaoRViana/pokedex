import React, { Component } from 'react'
import { getPokemon } from '../Services/getPokemons'


export default class PokemonDetail extends Component {
  state = {
    name:'',
    sprite:'',
    abilities:[],
    descriptionAbilities:[],
    height:'',
    weight:'',
    types:[],
    stats:[],
    imgType:'',
  }
  componentDidMount(){
    this.dataPokemon()
  }

  dataPokemon = async() =>{
    const {id} = this.props.match.params
    const data = await getPokemon(id);
    
    this.setState({
      name:data.name,
      sprite:data.sprites.versions['generation-v']['black-white']['animated']['front_default'],
      abilities:data.abilities,
      height:(data.height/10),
      weight:(data.weight/10),
      types:data.types,
      stats:data.stats,
      
    },()=>{
      this.abilityDescription()

    })
  }
  abilityDescription=()=>{
    const {abilities} = this.state;
    let newDescription = []
    abilities.map(async (e)=>{
      const name = e.ability.name;
      const url = e.ability.url;
      const api = await fetch (url);
      const data = await api.json();
      const description = data['effect_entries'].map((e)=>(e.language.name==='en'?e.effect:false))
      const obj = {
        name:name,
        description:description,
        hide: e.is_hidden,
      };
      newDescription.push(obj);
      this.setState({
        descriptionAbilities:newDescription,
      })
    })
    
  }
  render() {
    const {name,sprite,descriptionAbilities,height,weight,types,stats} =this.state
    return (
      
      <div>
        <div className='pokeCard'>
          <div className='pokeCardHeader'>
          <h1 className='pokeName'>{name}</h1>
          <div className='pokeCardHeader'>
          {types.map((e,index)=>(
          <div key={index}>
            <div className='pokeType' style={{ 
    backgroundImage: `url(${process.env.PUBLIC_URL + `/types/${e.type.name}.png`})` 
        }}></div>
          </div>
        ))}
          </div>
          
          </div>
        <img src={sprite} alt={name} className='pokeImgInCard'></img>
        <div className='pokeCardHeader'>
          <h3 className='pokeAttr'>height {height}m</h3>
          <h3 className='pokeAttr'>weight {weight}kg</h3>
        </div>
        </div>
        
        
        {descriptionAbilities.map((e)=>(
          <div key={e.name}>
            <h1>{e.name} {e.hide?'hide ability':''}</h1>
            <h2>{e.description}</h2>
          </div>
        ))}
       
        {stats.map((e)=>(
          <div key={e.stat.name}>
            <h3>{e.stat.name} {e.base_stat}</h3>
          </div>
        ))}
      </div>
    )
  }
}
