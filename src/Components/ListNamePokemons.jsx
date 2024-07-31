import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { setInfo,getPokemonsGen,getPokemon } from '../Services/getPokemons'
import Header from './Header'
import Loading from './Loading'

const pokeTypes = ['All','grass','fire','water','normal','electric','bug','dragon','flying','ghost','fairy','rock','ground','poison','fighting','ice','steel','psychic','dark']

export default class ListNamePokemons extends Component {
  state = {
    listPokemons:[],
    loading:false,
    name:'',
    listPokemonFiltred:[],
    selectFilter:'All',
    maxForPage:40,
    actualPage:1,
    lastPage:2,
    quantityLastPage:20,
    allPokemons:[],
    filterAvalaible:true,
  }

  componentDidMount(){
      this.setState({
        loading:true,
      },()=>{
        this.getAllPokemons();
      })
    
  }
  getAllPokemons = async() =>{
    const genId = (window.location.href)[window.location.href.length-1];
    try {
      let gen = await getPokemonsGen(genId)
      let pokemons = gen.pokemon_species;
      let allPokemons = await Promise.all(pokemons.map(async (e) => {
      try {
        const parts = e.url.split('/');
        const id = parts[parts.length - 2];
        let pokemon  = await getPokemon(id)
        return this.setInfoPokemon(pokemon)
      } catch (error) {
        console.error(`Error fetching pokemon ${e.name}:`, error);
        return null;
      }
    }));
    allPokemons =( allPokemons.filter((e)=>e!==null)).sort((a,b)=>a.pokedexNumber-b.pokedexNumber)
    this.setState({
      allPokemons,
      name:gen.main_region.name,
    },async ()=>{
      const { maxForPage } = this.state;
      const lastPage = Math.ceil(+allPokemons.length/maxForPage)
      const quantityLastPage = allPokemons.length - (maxForPage*(lastPage - 1))
      this.setState({
        limit: allPokemons.length,
        lastPage,
        quantityLastPage,
      },()=>{
        this.listing(0,maxForPage)
      })
    })
    } catch (error) {
          const{history}= this.props
          history.push('/')
    }
    
  }
  listing = async (first,quantity,actualPage=1) =>{
    const {allPokemons}=this.state;
    this.setState({
      loading:true,
      actualPage,

    },async()=>{
      let listingPokemons= []
      for(let i =0;i<quantity;i++){
        listingPokemons.push(allPokemons[first+i])
      }
      this.setState({
        listPokemons:listingPokemons,
        listPokemonFiltred:listingPokemons,
        loading:false,
      })
    })
  }

  nextPage = ({target})=>{
    const {lastPage,actualPage,quantityLastPage,maxForPage} = this.state;
    const nextPage =(+actualPage) + (+target.value)
    const first = (nextPage-1)*maxForPage
    if(nextPage <=0 || nextPage > lastPage){
      return false;
    }else if(nextPage === lastPage) {
      this.listing(first,quantityLastPage,nextPage)
    }
    else{
      this.listing(first,maxForPage,nextPage)
    }
  }
  setInfoPokemon = (pokemon)=>{
    const spr = setInfo(pokemon.sprites,pokemon.sprites.other['official-artwork'].front_default,['versions','generation-vii','icons','front_default'])
    const types = pokemon.types.map((e)=>(e.type.name))
    const obj = {
      name:pokemon.name,
      sprite:spr,
      types,
      pokedexNumber:pokemon.id,
    }
    return obj
  }
  

  handleChange=({target})=>{
    this.setState({
      selectFilter:target.value,
    },()=>{
      const {selectFilter,listPokemons ,allPokemons}= this.state;
      if(selectFilter !=='All'){
        const filtred = allPokemons.filter((e)=>(e.types.includes(selectFilter)))
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
    const {listPokemonFiltred,loading,name,actualPage ,lastPage ,selectFilter ,filterAvalaible} = this.state
    if(loading){return <Loading/>}
    return (
      <div>
        <Header/>
        <div className='allPokemons'>
        <div className='headerText textDescriptions'>
                <h1 className='titleWhite'>{name.toLocaleUpperCase()}</h1>
            </div>
            {filterAvalaible? <div className='selectFilterContainer'>
              <select onChange={this.handleChange}>{pokeTypes.map((e)=>(<option key={`filter ${e}`} value={e} className={`text${e}`}>{e}</option>))}</select>
          </div>:''}
           
        {listPokemonFiltred.map((e,index)=>(
        <div key={`pokemonFiltred ${index}`} ><Link className='links textDescriptions pokemonlist' to={`/pokemon/${e.pokedexNumber}`}>
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
      {selectFilter=== 'All'? <div className='listPokemonFooter textDescriptions'>
      <h1 className='titleWhite' >{actualPage}/{lastPage}</h1>
      <div>
        {actualPage === 1? '':<button onClick={this.nextPage}value={-1} className='textStyled  arrows'>{'<-'}</button>}
        {actualPage === lastPage?'':<button onClick={this.nextPage} value={+1} className='textStyled  arrows'>{'->'}</button>}
      </div>
      </div>:''}
      </div>
      </div>
    )
  }
}
