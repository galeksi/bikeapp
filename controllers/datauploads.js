const dataRouter = require('express').Router()
const Station = require('../models/station')
const Trip = require('../models/trips')

const csv = require('fast-csv')
const fs = require('fs')
const multer = require('multer')
const upload = multer({ dest: 'tmp/csv/' })

const stationValidator = (obj) => {
  if (obj.kaupunki === ' ') obj.kaupunki = 'Helsinki'
  if (obj.stad === ' ') obj.stad = 'Helsingfors'
  if (obj.operator === ' ') obj.operator = 'CityBike Finland'
  // console.log(obj)
  return obj
}

const tripValidator = (obj, stations) => {
  // console.log(stations)
  if (obj.distance < 10 || obj.duration < 10) return null
  if (obj.departureStation === '997' || obj.departureStation === '999') {
    return null
  }
  if (obj.returnStation === '997' || obj.returnStation === '999') {
    return null
  }

  delete obj.departureStationName
  delete obj.returnStationName

  const depStation = stations.find(
    (s) => s.number === Number(obj.departureStation)
  )
  if (depStation) obj.departureStation = depStation.id

  const retStation = stations.find(
    (s) => s.number === Number(obj.returnStation)
  )
  if (retStation) obj.returnStation = retStation.id

  return obj
}

const readCsv = (path, options, validator, validatorData) => {
  return new Promise((resolve, reject) => {
    const fileRows = []

    csv
      .parseFile(path, options)
      .on('error', (error) => {
        console.error(error)
        return reject(error)
      })
      .on('data', (row) => {
        const validData = validator ? validator(row, validatorData) : row
        if (validData) fileRows.push(validData)
      })
      .on('end', () => {
        fs.unlinkSync(path)
        resolve(fileRows)
      })
  })
}

dataRouter.post('/trips', upload.single('file'), async (req, res) => {
  const stations = await Station.find({})
  // console.log(stations)

  const tripHeader = [
    'departure',
    'return',
    'departureStation',
    'departureStationName',
    'returnStation',
    'returnStationName',
    'distance',
    'duration',
  ]

  const data = await readCsv(
    req.file.path,
    {
      headers: tripHeader,
      renameHeaders: true,
    },
    tripValidator,
    stations
  )
  console.log(data)

  await Trip.deleteMany({})
  const savedTrips = await Trip.insertMany(data)

  if (savedTrips) {
    res.json({
      'valid imports': data.length,
      uploads: savedTrips.length,
    })
  } else {
    res.status(404).end()
  }
})

dataRouter.post('/stations', upload.single('file'), async (req, res) => {
  const stationHeader = [
    'fid',
    'number',
    'nimi',
    'namn',
    'name',
    'osoite',
    'adress',
    'kaupunki',
    'stad',
    'operator',
    'capacity',
    'long',
    'lat',
  ]

  const data = await readCsv(
    req.file.path,
    {
      headers: stationHeader,
      renameHeaders: true,
    },
    stationValidator
  )

  await Station.deleteMany({})
  const savedStations = await Station.insertMany(data)

  if (savedStations) {
    res.json({
      'valid imports': data.length,
      uploads: savedStations.length,
    })
  } else {
    res.status(404).end()
  }
})

module.exports = dataRouter
