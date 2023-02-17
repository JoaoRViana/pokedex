import React, { Component } from 'react'
import { getPokemon } from '../Services/getPokemons'
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
    let habitat =''
    try {
      habitat=dataSpecies.habitat.name
    } catch (error) {
      habitat = 'grassland'
    }
    this.setState({
      name: data.name,
      sprite: data.sprites.versions['generation-v']['black-white']['animated']['front_default'],
      abilities: data.abilities,
      height: (data.height / 10),
      weight: (data.weight / 10),
      types: data.types,
      stats: data.stats,
      description: textDescriptions,
      habitat: habitat,
    }, () => {
      this.abilityDescription()

    })
  }
  abilityDescription = () => {
    const { abilities } = this.state;
    let newDescription = []
    abilities.map(async (e) => {
      const name = e.ability.name;
      const url = e.ability.url;
      const api = await fetch(url);
      const data = await api.json();
      const description = data['effect_entries'].map((e) => (e.language.name === 'en' ? e.effect : false))
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
            <h1 className='pokeName'>{name}</h1>
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
            <img src={sprite} alt={name} className='pokeImgInCard' ></img>
          </div>

          <div className='pokeCardHeader textDescriptions'>
            <h3 className='pokeAttr'>height {height}m</h3>
            <h3 className='pokeAttr'>weight {weight}kg</h3>
          </div>
        </div>
        <div className='pokeDescriptions textDescriptions'>
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
