import React from 'react'

const BackToMenu = (props) => {
    if(!props.show) {
        return null
    }

    return (
        <button className='backToMenu' onClick={() => props.setPage('menu')}>Takaisin valikkoon</button>
    )
}

export default BackToMenu