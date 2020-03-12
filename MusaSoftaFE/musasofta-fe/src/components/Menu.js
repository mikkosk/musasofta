import React from 'react'

const Menu = (props) => {
    if (!props.show) {
        return null
    }
    
    return (
        <div>
            <h1>KäsiMusiikki</h1>
            <button onClick={() => props.setPage('pieces')}>Kappaleet</button>
            <button onClick={() => props.setPage('addPiece')}>Lisää kappale</button>
            <p></p>
            <p>v. 0.0.1</p>
        </div>
    )
}

export default Menu