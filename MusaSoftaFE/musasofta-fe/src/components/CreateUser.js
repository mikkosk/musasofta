import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { CREATE_USER } from '../queries'
import errorHandler from '../utils/errorHandler'

const CreateUser = (props) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const onError = (error) => {
        errorHandler.handleError(props.setNotification, error.graphQLErrors[0].message)
    }

    const [createUser] = useMutation(CREATE_USER, {
        onError
    })

    if(!props.show) {
        return null
    }

    const submit = async (event) => {
        event.preventDefault()

        if(!username || !password) {
            errorHandler.handleError(props.setNotification, 'Et voi jättää kenttiä tyhjäksi')
        }
        await createUser({ variables: {username, password}})
        props.setPage('menu')
    }

    return (
        <div>
            <h2>
                Luo uusi käyttäjä
            </h2>
            <form onSubmit={submit}>
                <div>
                    Käyttäjätunnus 
                    <input value={username} onChange={({target}) => setUsername(target.value)} />
                </div>
                <div>
                    Salasana
                    <input value={password} onChange={({target}) => setPassword(target.value)} />
                </div>
                <button type='submit'>Luo</button>
            </form>
        </div>
    )
}

export default CreateUser