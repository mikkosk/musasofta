import React from 'react'
import { useApolloClient } from '@apollo/react-hooks'

const Logout = (props) => {
    const client = useApolloClient()
    const logout = () => {
        props.setToken(null)
        localStorage.clear()
        client.resetStore()
    }

    return (
        <div>
            <button onClick={logout}>Kirjaudu ulos</button>
        </div>
    )
}

export default Logout