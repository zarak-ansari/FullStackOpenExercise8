import { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import { useSubscription } from '@apollo/client'
import { BOOK_ADDED, ALL_BOOKS } from './queries'
import { useApolloClient } from '@apollo/client'

// function that takes care of manipulating cache
export const updateCache = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }


  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState()
  const client = useApolloClient()
  
  useEffect(() => {
    const tokenInLocalStorage = localStorage.getItem('library-jwt-token')
    if(tokenInLocalStorage) setToken(tokenInLocalStorage)
  }, [])
  
  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      window.alert(`New book added "${addedBook.title}"`)
      updateCache(client.cache, {query:ALL_BOOKS, variables:{genre:null}}, addedBook)
    },
  })

  const logout = () => {
    setToken(null)
    localStorage.removeItem('library-jwt-token')
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && <button onClick={() => setPage('recommend')}>recommend</button>}
        {!token && <button onClick={() => setPage('login')}>Log In</button>}
        {token && <button onClick={logout}>Log Out</button>}
      </div>

      <Authors show={page === 'authors'} token={token}/>

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <LoginForm show={page === 'login'} setToken={setToken} setPageToBooks={() => setPage('books')} />

      <Recommend show={page === 'recommend'} />

    </div>
  )
}

export default App
