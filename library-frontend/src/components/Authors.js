import { useQuery } from "@apollo/client"
import { ALL_AUTHORS } from "../queries"
import AuthorBirthYearForm from "./AuthorBirthYearForm"
import { useEffect, useState } from "react"

const Authors = (props) => {
  
  const result = useQuery(ALL_AUTHORS)
  const [authors, setAuthors] = useState([])

  useEffect(() => {
    if(result.data){
      setAuthors(result.data.allAuthors)
    }
  }, [result.data])

  if (!props.show) {
    return null
  }

  if(result.loading){
    return <div>loading list of authors</div>
  }

  // const authors = result.data.allAuthors
  
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {props.token && <AuthorBirthYearForm authors={authors} />}
    </div>
  )
}

export default Authors
