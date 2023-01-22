const http = require('http')
require('dotenv').config()

const express = require('express')
const app = express()
const dataRouter = require('./controllers/datauploads')

const mongoose = require('mongoose')
const mongoUrl = process.env.MONGODB_URI

console.log('Connecting to database...')
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log('connected')
  })
  .catch((err) => {
    console.log(err.message)
  })

app.use('/upload-csv', dataRouter)

const PORT = process.env.PORT
const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
