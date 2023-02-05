const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../index')
const path = require('node:path')

const api = supertest(app)

test('stations are saved to the database', async () => {
  await api
    .post('/upload-csv/stations')
    .attach('file', path.resolve(__dirname, './csv/stations.csv'))
    .expect(200)
})

afterAll(async () => {
  await mongoose.connection.close()
  // server.close()
})
