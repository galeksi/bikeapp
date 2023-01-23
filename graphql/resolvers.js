const Station = require('../models/station')
const Trip = require('../models/trips')

const resolvers = {
  Query: {
    allStations: async (root, args) =>
      Station.find({}).skip(args.offset).limit(args.limit),
    allTrips: async (root, args) =>
      Trip.find({}).skip(args.offset).limit(args.limit),
  },
  Trip: {
    departureStation: async (root) => {
      const station = await Station.findOne({ _id: root.departureStation })
      return {
        id: station.id,
        nimi: station.nimi,
        number: station.number,
        osoite: station.osoite,
        kaupunki: station.kaupunki,
      }
    },
    returnStation: async (root) => {
      const station = await Station.findOne({ _id: root.returnStation })
      return {
        id: station.id,
        nimi: station.nimi,
        number: station.number,
        osoite: station.osoite,
        kaupunki: station.kaupunki,
      }
    },
  },
}

module.exports = resolvers
