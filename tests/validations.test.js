// const csv = require('fast-csv')
const fs = require('fs')
const path = require('node:path')
const { readCsv } = require('../controllers/datauploads')

beforeEach(() => {
  const filePath = path.resolve(__dirname, './csv/stations.csv')
  fs.copyFile(filePath, path.resolve(__dirname, '../tmp/csv/'), (err) => {
    if (err) console.log(err)
  })
})

test('Parse csv file', async () => {
  const result = await readCsv(
    path.resolve(__dirname, '../tmp/csv/stations.csv')
  )

  expect(result.length).toBe(12)
})
