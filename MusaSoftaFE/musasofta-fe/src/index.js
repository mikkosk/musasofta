import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { createUploadLink } from 'apollo-upload-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'

import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import './index.css'

const wsLink = new WebSocketLink({
    uri: `ws://localhost:4000/graphql`,
    options: { reconnect: true }
})
  
const uploadLink = createUploadLink({
    uri: 'http://localhost:4000/graphql'
})

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('user-token')
    return{
        headers: {
            ...headers,
            authorization: token ? `bearer ${token}` : null
        }
    }
})

const link = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query)
      return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    authLink.concat(uploadLink)
)

const client = new ApolloClient({
    link,
    cache: new InMemoryCache()
})
ReactDOM.render(
    <ApolloProvider className='full' client={client} >
        <App className='full'/>
    </ApolloProvider>, 
    document.getElementById('root'));

