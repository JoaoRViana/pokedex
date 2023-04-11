import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { getSomePokemons } from '../Services/getPokemons'
import Header from './Header'
import Loading from './Loading'

const pokeTypes = ['All','grass','fire','water','normal','electric','bug','dragon','flying','ghost','fairy','rock','ground','poison','fighting','ice','steel','psychic','dark']

export default class ListNamePokemons extends Component {
  state = {
    listPokemons:[],
    min:0,
    limit:42,
    loading:false,
    name:'',
    listPokemonFiltred:[],
    selectFilter:'All',
  }

  componentDidMount(){
    const { first,pokemons,name } = this.props.location.state.gen
    this.setState({
      min:first,
      limit: pokemons,
      name:name,
    },()=>{
      this.listing()
    })
  }
  listing = async () =>{
    const{min,limit} = this.state;
    this.setState({
      loading:true,
    })
    const pokemons = await getSomePokemons(min,limit)
    this.setState({
      listPokemons:pokemons,
      listPokemonFiltred:pokemons,
      loading:false,
    })
  }

  handleChange=({target})=>{
    this.setState({
      selectFilter:target.value,
    },()=>{
      const {selectFilter,listPokemons}= this.state;
      console.log(listPokemons)
      if(selectFilter !=='All'){
        const filtred = listPokemons.filter((e)=>(e.types.includes(selectFilter)))
        this.setState({
          listPokemonFiltred:filtred,
        })
      }else{
        this.setState({
          listPokemonFiltred:listPokemons,
        })
      }

      
    })
  }

  render() {
    const {listPokemonFiltred,loading,name} = this.state
    if(loading){return <Loading/>}
    return (
      <div>
        <Header/>
        <div className='allPokemons'>
        <div className='headerText textDescriptions'>
                <h1 className='titleWhite'>{name.toLocaleUpperCase()}</h1>
            </div>
            <div className='selectFilterContainer'>
              <select onChange={this.handleChange}>{pokeTypes.map((e)=>(<option value={e} className={`text${e}`}>{e}</option>))}</select>
          </div>
        {listPokemonFiltred.map((e,index)=>(
        <div key={index} ><Link className='links textDescriptions pokemonlist' to={`/pokemon/${e.pokedexNumber}`}>
          <div>
            <h4 className='pokemonlistText'>{e.pokedexNumber}.{e.name}</h4>
            <div className='pokemonlistText'>
            {e.types.map((f)=>(<h4 className={`text${f} pokemonlistText` }>{f}</h4>))}
            </div>
            <img src={e.sprite} alt={e.name} className='pokeImgHome'/>
          </div>
        </Link>
        </div>
      ))}
      </div>
      </div>
    )
  }
}
