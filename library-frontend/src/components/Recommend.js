import { useLazyQuery, useQuery } from "@apollo/client"
import { ALL_BOOKS, CURRENT_USER } from "../queries"
import { useEffect, useState } from "react"

const Recommend = (props) => {
    const [favoriteGenre, setFavoriteGenre] = useState(null)
    const currentUserQuery = useQuery(CURRENT_USER)
    const booksQuery = useQuery(ALL_BOOKS, {variables:{genre:favoriteGenre}, skip:!favoriteGenre})
    const [getBooks, booksResult] = useLazyQuery(ALL_BOOKS) 
    
    useEffect(() => {
        if(currentUserQuery.data && currentUserQuery.data.me){
            const genre = currentUserQuery.data.me.favoriteGenre 
            setFavoriteGenre(genre)
            getBooks({variables:{genre}})
        }
    }, [currentUserQuery.data]) // eslint-disable-line
    
    if(!props.show) return null
    
    if(currentUserQuery.loading) {
        return <div>still loading user...</div>
    }

    return (
        <div>
            <h2>recommendations</h2>
            <p>books in your favorite genre <strong>{favoriteGenre}</strong></p>
            {booksQuery.data && (
                <table>
                <tbody>
                <tr>
                    <th>title</th>
                    <th>author</th>
                    <th>published</th>
                </tr>
                {booksResult.data.allBooks.map((a) => (
                    <tr key={a.id}> 
                        <td>{a.title}</td>
                        <td>{a.author.name}</td>
                        <td>{a.published}</td>
                    </tr>
                ))}
                </tbody>
            </table>              
            )}
        </div>
    )
}

export default Recommend