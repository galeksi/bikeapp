// Dataloader is added to Apollo Server to solve 1+N problem when trips a queried with refrenced departure and return stations
const DataLoader = require('dataloader')
const Station = require('../models/station')

// Loader queries all stations once after trips are queried and returns needed stations in full
const stationsLoader = new DataLoader(async (stationIds) => {
  const stations = await Station.find({})
  return stationIds.map((id) => {
    return stations.find((s) => JSON.stringify(s.id) === JSON.stringify(id))
  })
})

module.exports = stationsLoader
