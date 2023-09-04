const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const Book = require('./models/bookSchema')
const Author = require('./models/authorSchema')
const { GraphQLError } = require('graphql')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to ' + MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => console.log('connected to Mongo DB'))
  .catch(error => console.log(error.message))


const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type Query {
    bookCount: Int
    authorCount: Int
    allBooks (
        author: String
        genre: String
    ): [Book!]!
    allAuthors: [Author]
  }

  type Mutation {
    addBook (
        title: String!
        published: Int!
        author: String!
        genres: [String!]!
    ): Book!

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: async () => await Book.collection.countDocuments(),
    authorCount: async () => await Author.collection.countDocuments(),
    allBooks: async (_, args) => {
        let result = await Book.find({}).populate('author', {name:1, born:1}) 
        if(args.author){
          result = result.filter(book => book.author.name === args.author)
        }
        if(args.genre) {
          result = result.filter(book => book.genres.includes(args.genre))
        }
        return result
    },
    allAuthors: async () => Author.find({})
  },
  Mutation: {
    addBook: async (_, args) => {
      
      let author = await Author.findOne({name: args.author})
      if (author === null) {
        author = new Author({
          name:args.author,
          born:null,
        })
        try {
          author = await author.save()
        } catch (error) {
          throw new GraphQLError('Saving author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        }
      }
      const newBook = new Book({...args, author: author.id})
      try {
        await newBook.save()
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error
          }
        })
      }
      return newBook
    },
    editAuthor: async (_, args) => {
      const authorInDb = Author.find({name: args.name})
      if(!authorInDb) return null

      const updatedAuthor = await Author.findOneAndUpdate({name: args.name}, {born:args.setBornTo})

      return updatedAuthor
    }
  },
  Author: {
    bookCount: async (root) => {
      // woefully inefficient. look into mongoose functions to make it easier. or give a ref of books to author
      const books = await Book.find({}).populate('author', {name:1})
      return books.filter(book => book.author.name === root.name).length
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})