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
    maxForPage:13,
    actualPage:1,
    lastPage:2,
    quantityLastPage:20,
    allPokemons:[],
  }

  componentDidMount(){
    const{history}= this.props
    const{maxForPage} = this.state
    try {
      const { first,pokemons,name } = this.props.location.state.gen
      const lastPage = Math.ceil(+pokemons/maxForPage)
      const quantityLastPage = pokemons - (maxForPage*(lastPage - 1))
      this.setState({
        min:first,
        limit: pokemons,
        name:name,
        lastPage,
        quantityLastPage,
      },()=>{
        const{min,maxForPage} = this.state
        this.listing(min,maxForPage)
        this.getAllPokemons();
      })
    } catch (error) {
      history.push('/')
    }
  }
  getAllPokemons = async() =>{
    const{min,limit} = this.state
    const all = await getSomePokemons(min,limit)
    this.setState({
      allPokemons:all,
    })
  }
  listing = async (first,maxForPage,actualPage = 1) =>{
    this.setState({
      loading:true,
      actualPage,

    },async()=>{
      const pokemons = await getSomePokemons((first),maxForPage)
      this.setState({
        listPokemons:pokemons,
        listPokemonFiltred:pokemons,
        loading:false,
      })
    })
  }

  nextPage = ({target})=>{
    const {lastPage,actualPage,quantityLastPage,maxForPage,min} = this.state;
    const nextPage =(+actualPage) + (+target.value)
    const first = min+((nextPage-1)*maxForPage);
    if(nextPage <=0 || nextPage > lastPage){
      return false;
    }else if(nextPage === lastPage){
      this.listing(first,quantityLastPage,nextPage)
    }
    else{
      this.listing(first,maxForPage,nextPage)
    }
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
    const {listPokemonFiltred,loading,name,actualPage ,lastPage ,selectFilter} = this.state
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
