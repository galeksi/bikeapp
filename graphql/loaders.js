const DataLoader = require('dataloader')
const Station = require('../models/station')

const stationsLoader = new DataLoader(async (stationIds) => {
  const stations = await Station.find({})
  return stationIds.map((id) => {
    return stations.find((s) => JSON.stringify(s.id) === JSON.stringify(id))
  })
})

module.exports = stationsLoader
