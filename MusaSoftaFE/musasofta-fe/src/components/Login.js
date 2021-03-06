import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { LOGIN, CURRENT_USER } from '../queries'
import errorHandler from '../utils/errorHandler'

const Login = (props) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')


    const onError = (error) => {
        errorHandler.handleError(props.setNotification, error.graphQLErrors[0].message)
    }
    const [ login, result ] = useMutation(LOGIN, {
        onError,
        refetchQueries: [{
            query: CURRENT_USER
        }]
    })

    useEffect(() => {
        if(result.data) {
            const token = result.data.login.value
            props.setToken(token)
            localStorage.setItem('user-token', token)
            props.setPage('menu')
            window.location.reload()
        }
    }, [result.data, props])

    if(!props.show) {
        return null
    }

    const submit = async (event) => {
        event.preventDefault()
        await login({ variables: {username, password }})
    }

    return (
        <div className='topMargin'>
            <form onSubmit={submit}>
                <div>
                    <div>
                        <p>Käyttäjätunnus</p>
                    </div>                 
                    <input value={username} onChange={({target}) => setUsername(target.value)} />
                </div>
                <div>
                    <div>
                        <p>Salasana</p>
                    </div>    
                    <input value={password} onChange={({target}) => setPassword(target.value)} />
                </div>
                <button className='topMargin' type='submit'>Kirjaudu</button>
            </form>
        </div>
    )
}

export default Login