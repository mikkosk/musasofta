import React from 'react'
import { useApolloClient } from '@apollo/react-hooks'
import '../index.css'

const Logout = (props) => {
    const client = useApolloClient()
    const logout = () => {
        props.setToken(null)
        localStorage.clear()
        client.resetStore()
        window.location.reload()
    }

    return (
        <div>
            <button className='buttonLog' onClick={logout}>Kirjaudu ulos</button>
        </div>
    )
}

export default Logout