const Station = require('../models/station')
const Trip = require('../models/trips')
var _ = require('lodash')
const stationsLoader = require('./loaders')

const calculateAvg = (trips) => {
  const distance = trips.reduce((a, b) => a + b.distance, 0)
  return (distance / trips.length / 1000).toFixed(1)
}

const getMostPopular = (trips, station) => {
  const counted = _.countBy(trips, station)
  const sorted = Object.entries(counted)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
  return sorted.map((s) => s[0])
}

const resolvers = {
  Query: {
    allStations: async (root, args) =>
      Station.find({}).skip(args.offset).limit(args.limit),
    singleStation: async (root, args) => Station.findById(args.id),
    allTrips: async (root, args) => {
      const params = {}
      if (args.departure) params.departureStation = args.departure
      if (args.return) params.returnStation = args.return
      if (args.date) {
        const dateMin = new Date(args.date)
        const dateMax = new Date(dateMin.getTime() + 86400000)
        params.departure = {
          $gte: dateMin,
          $lt: dateMax,
        }
      }

      return Trip.find(params).sort({ departure: -1 }).limit(args.limit)
    },
    latestTrips: async (root, args) =>
      Trip.find().sort({ departure: -1 }).limit(args.limit),
    stationStats: async (root, args) => {
      const departureTrips = await Trip.find({
        departureStation: args.id,
      }).limit(args.limit)
      const returnTrips = await Trip.find({ returnStation: args.id })

      return {
        stationId: args.id,
        startTotal: departureTrips.length,
        returnTotal: returnTrips.length,
        startAvg: calculateAvg(departureTrips),
        returnAvg: calculateAvg(returnTrips),
        popularReturn: getMostPopular(departureTrips, 'returnStation'),
        popularDeparture: getMostPopular(returnTrips, 'departureStation'),
      }
    },
  },
  Trip: {
    departureStation: async (root, args, context) => {
      const station = await context.stationsLoader.load(root.departureStation)
      console.log(station)
      return {
        id: station.id,
        nimi: station.nimi,
        number: station.number,
        osoite: station.osoite,
        kaupunki: station.kaupunki,
      }
    },
    returnStation: async (root, args, context) => {
      const station = await context.stationsLoader.load(root.returnStation)
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
