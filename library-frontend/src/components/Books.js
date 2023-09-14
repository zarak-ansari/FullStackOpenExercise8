import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../queries"
import { useState, useEffect } from "react"

const ALL_GENRE_STRING = 'All Genres'

const Books = (props) => {
  
  const result = useQuery(ALL_BOOKS)
  const [allGenres, setAllGenres] = useState([ALL_GENRE_STRING])
  const [chosenGenre, setChosenGenre] = useState(ALL_GENRE_STRING)
  const [books, setBooks] = useState()

  useEffect(() => {
    if(result.data){
      setBooks(result.data.allBooks)
      if(chosenGenre === ALL_GENRE_STRING){
        let genres = [ALL_GENRE_STRING]
        result.data.allBooks.forEach(book => {
          genres = genres.concat(book.genres)
        })
        setAllGenres([...new Set(genres)])
      }
    }
  }, [result.data]) // eslint-disable-line

  useEffect(() => {
    if(chosenGenre === ALL_GENRE_STRING){
      result.refetch({genre:null})
    } else {
      result.refetch({genre:chosenGenre})
    }
  }, [chosenGenre]) // eslint-disable-line

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return (
      <div>
        list of books is still loading...
      </div>
    )
  }

  if(result.error) {
    return(
      <div>
        error loading list of books
      </div>
    )
  }

  
  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}> 
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {allGenres.map(genre => <button key={genre} onClick={() => setChosenGenre(genre)}>{genre}</button>)}
      </div>
    </div>
  )
}

export default Books
