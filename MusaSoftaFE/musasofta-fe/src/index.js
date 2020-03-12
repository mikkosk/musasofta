import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { createUploadLink } from 'apollo-upload-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'


const wsLink = new WebSocketLink({
    uri: `ws://localhost:4000/graphql`,
    options: { reconnect: true }
})
  
///Pitää ehkä poistaa


const uploadLink = createUploadLink({
    uri: 'http://localhost:4000/graphql'
})

const link = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query)
      return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    uploadLink
)

const client = new ApolloClient({
    link,
    cache: new InMemoryCache()
})
ReactDOM.render(
    <ApolloProvider client={client} >
        <App />
    </ApolloProvider>, 
    document.getElementById('root'));
