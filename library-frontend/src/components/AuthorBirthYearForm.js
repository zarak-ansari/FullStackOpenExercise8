import { useMutation } from "@apollo/client"
import { useState } from "react"
import { ALL_AUTHORS, CHANGE_BIRTH_YEAR } from "../queries"

const AuthorBirthYearForm = ({ authors }) => {
    const [ authorName, setAuthorname ] = useState('')
    const [ birthYear, setBirthYear ] = useState('')

    const [ editAuthor ] = useMutation(CHANGE_BIRTH_YEAR, {
        refetchQueries: [ {query: ALL_AUTHORS} ]
    })

    const changeBirthYear = (event) => {
        event.preventDefault()

        editAuthor({ variables: { authorName, birthYear: parseInt(birthYear) } })

        setAuthorname('')
        setBirthYear('')
    }

    return(
        <div>
            <h2>Set Birth Year</h2>
            <form>
                <div>
                    name
                    <select value={authorName} onChange={e => setAuthorname(e.target.value)}>
                        <option key='1' value="" disabled>Choose here</option>
                        {authors.map(author => <option value={author.name} key={author.id}>{author.name}</option>)}
                    </select>
                </div>
                <div>
                    born
                    <input 
                        type="number"
                        value={birthYear}
                        onChange={e => setBirthYear(e.target.value)}
                    />
                </div>
                <button onClick={changeBirthYear}>update author</button>
            </form>
        </div>
    )
}

export default AuthorBirthYearForm