import React from 'react'
import Logout from './Logout'
import '../index.css'

const Menu = (props) => {
    
    if (!props.show) {
        return null
    }

    const showWhenToken = { display: props.token ? '' : 'none'}
    const showWhenNoToken = { display: props.token ? 'none' : ''}
    
    return (
        <div className='full'>
                <div className='centerDiv'>
                    <div className='title'>
                        <h1 className='titleText'>KäsiMusiikki</h1>
                    </div>
                    <div className='logged' style={showWhenNoToken}>
                        <button className='buttonLog' onClick={() => props.setPage('login')}>Kirjaudu</button>
                    </div>
                    <div className='logged' style={showWhenToken}>
                        <Logout setToken={ props.setToken }/>
                    </div>
                    <div className='create' style={showWhenNoToken}>
                        <button className='buttonLog' onClick={() => props.setPage('createUser')}>Luo käyttäjä</button>
                    </div>
                    <div className='pieces'>
                        <button className='buttonBig' onClick={() => props.setPage('pieces')}>Kappaleet</button>
                    </div>

                    <div className='add' style={showWhenToken}>
                        <button className='buttonBig' onClick={() => props.setPage('addPiece')}>Lisää kappale</button>
                    </div>

                </div>
            <div>
                <p></p>
                <p>v. 0.0.1</p>
            </div>
        </div>
    )
}

export default Menu