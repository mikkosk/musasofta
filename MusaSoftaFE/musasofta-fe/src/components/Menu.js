import React from 'react'
import Logout from './Logout'

const Menu = (props) => {
    
    if (!props.show) {
        return null
    }

    const showWhenToken = { display: props.token ? '' : 'none'}
    const showWhenNoToken = { display: props.token ? 'none' : ''}
    
    return (
        <div>
            <h1>KäsiMusiikki</h1>
            <button onClick={() => props.setPage('pieces')}>Kappaleet</button>
            <div style={showWhenToken}>
                <button onClick={() => props.setPage('addPiece')}>Lisää kappale</button>
                <Logout setToken={ props.setToken }/>
            </div>
            <div style={showWhenNoToken}>
                <button onClick={() => props.setPage('login')}>Kirjaudu</button>
                <button onClick={() => props.setPage('createUser')}>Luo käyttäjä</button>
            </div>

            <p></p>
            <p>v. 0.0.1</p>
        </div>
    )
}

export default Menu