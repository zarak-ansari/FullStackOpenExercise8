import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('library-jwt-token')
    return {
        headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : null,
        }
    }
    })

const httpLink = createHttpLink({
    uri: 'http://localhost:4000',
})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
})

ReactDOM.createRoot(document.getElementById('root')).render(<ApolloProvider client={client}><App /></ApolloProvider>)