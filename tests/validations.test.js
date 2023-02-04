// const csv = require('fast-csv')
const fs = require('fs')
const fsPromises = require('fs').promises
const { readCsv } = require('../controllers/datauploads')

test('Parse csv file', async () => {
  fs.copyFile('./csv/stations.csv', '../tmp/csv/', (err) => {
    if (err) console.log(err)
  })
  const result = await readCsv('./csv/stations')

  expect(result.length).toBe(9)
})
