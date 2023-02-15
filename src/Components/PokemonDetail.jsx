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
      types:data.types
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
    const {name,sprite,descriptionAbilities,height,weight,types} =this.state
    return (
      <div>
        <h1>{name}</h1>
        {types.map((e)=>(
          <h2>{e.type.name}</h2>
        ))}
        <img src={sprite} alt={name}></img>
        {descriptionAbilities.map((e,index)=>(
          <div key={index}>
            {console.log(e.hide)}
            <h1>{e.name} {e.hide?'hide ability':''}</h1>
            <h2>{e.description}</h2>
          </div>
        ))}
        <h3>height {height}m</h3>
        <h3>weight {weight}kg</h3>
      </div>
    )
  }
}
