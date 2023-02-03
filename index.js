const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const express = require('express')
const http = require('http')
const cors = require('cors')
const bodyParser = require('body-parser')

require('dotenv').config()

const dataRouter = require('./controllers/datauploads')
const typeDefs = require('./graphql/typedefs')
const resolvers = require('./graphql/resolvers')
const stationsLoader = require('./graphql/loaders')

const mongoose = require('mongoose')
const mongoUrl = process.env.MONGODB_URI

// Connects to MongoDB Database
console.log('Connecting to database...')
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log('connected')
  })
  .catch((err) => {
    console.log(err.message)
  })

// Creates express server, apollo gql server, adds middleware dataloader and starts server
const start = async () => {
  const app = express()
  const server = new ApolloServer({ typeDefs, resolvers })

  await server.start()

  app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        return { stationsLoader }
      },
    })
  )
  app.use(express.static('build'))
  app.use('/upload-csv', dataRouter)

  const PORT = process.env.PORT
  // const server = http.createServer(app)
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
