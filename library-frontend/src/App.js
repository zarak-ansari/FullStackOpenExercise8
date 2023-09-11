import { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState()
  
  useEffect(() => {
    const tokenInLocalStorage = localStorage.getItem('library-jwt-token')
    if(tokenInLocalStorage) setToken(tokenInLocalStorage)
  }, [])
  
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
