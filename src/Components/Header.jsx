import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Header extends Component {
    state = {
        inputValue:'',
        clicked:false,
    }

    handleChange = ({target}) =>{
        console.log(this.props)
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            [target.id]:value.toLowerCase(),
        },()=>{
            const{inputValue}=this.state
            document.addEventListener('keypress',function(key){
                if(key.which === 13){
                    window.location.replace(`/pokemon/${inputValue}`)
                }
            })
        })  
    }
  render() {
    const {inputValue,clicked} = this.state
    if(clicked === ''){document.location.reload()}
    return (
      <div>
        <div className='header'>
            <Link to='/'>
                <button className='textDescriptions headerButton titleWhite'>Home</button>
            </Link>
            <div className='inputDiv'>
                <input placeholder='type name or number' className='inputUser' onChange={this.handleChange} value={inputValue} id='inputValue'></input>
                <Link to={`/pokemon/${inputValue}`}>
                    <button className='headerButton inputButton' onClick={this.handleChange} id='clicked'></button>
                </Link>
            </div>
            <Link to='/favorites'>
                <button className='textDescriptions headerButton titleWhite'>Favorites</button>
            </Link>
        </div>
      </div>
    )
  }
}
