const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const Book = require('./models/bookSchema')
const Author = require('./models/authorSchema')
const User = require('./models/userSchema')

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

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }
  
  type Query {
    bookCount: Int
    authorCount: Int
    allBooks (
        author: String
        genre: String
    ): [Book!]!
    allAuthors: [Author]
    me: User
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

    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    
    login(
      username: String!
      password: String!
    ): Token
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
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => context.currentUser
  },
  Mutation: {
    addBook: async (_, args, context) => {
      
      if(!context.currentUser) return null

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
    editAuthor: async (_, args, context) => {
      
      if(!context.currentUser) return null

      return Author.findOneAndUpdate({ name: args.name }, { born:args.setBornTo })
    },
    createUser: async (_, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

      return user.save()
        .catch(error => {
          throw new GraphQLError('User creation failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.username,
              error
            }
          })
        })
    },
    login: async (_, args) => {
      const user = await User.findOne({ username: args.username })

      if(!user || args.password !== 'secret') {
        throw new GraphQLError('Login failed', {
          extensions:{
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET)}
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

  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})