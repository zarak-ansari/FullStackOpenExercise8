import { gql } from "@apollo/client"

export const ALL_AUTHORS = gql`
query {
    allAuthors {
        id,
        name,
        born,
        bookCount
    }
}
`

export const ALL_BOOKS = gql`
query {
    allBooks {
        id,
        title,
        published,
        author {
            id,
            name
        }
    }
}
`

export const CREATE_BOOK = gql`
mutation addBook(
        $title: String!,
        $published: Int!,
        $author: String!,
        $genres: [String!]!
    ) 
    {
        addBook(title: $title, published: $published, author: $author, genres: $genres) {
            id,
            title,
            published,
            author,
            genres
       }
    }
`

export const CHANGE_BIRTH_YEAR = gql`
mutation editAuthor(
    $authorName: String!,
    $birthYear: Int!
)
{
    editAuthor(name:$authorName, setBornTo:$birthYear){
        id,
        name,
        born
    }
}
`