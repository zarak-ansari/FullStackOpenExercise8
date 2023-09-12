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
query ($genre: String) {
    allBooks (genre: $genre) {
        id,
        title,
        published,
        author {
            name
        },
        genres
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

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const CURRENT_USER = gql`
  query {
    me {
        favoriteGenre
    }
  }
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
        id,
        title,
        published,
        genres
    }
  }
`