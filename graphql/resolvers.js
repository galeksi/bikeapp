const Station = require('../models/station')
const Trip = require('../models/trips')
var _ = require('lodash')

// Calculates average distance in km for given trips
const calculateAvg = (trips) => {
  const distance = trips.reduce((a, b) => a + b.distance, 0)
  return (distance / trips.length / 1000).toFixed(1)
}

// Counts all departure or return stations for given trips, sorts them and returns five highest
const getMostPopular = (trips, station) => {
  const counted = _.countBy(trips, station)
  const sorted = Object.entries(counted)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
  return sorted.map((s) => s[0])
}

// Apollo server query resolvers
const resolvers = {
  Query: {
    allStations: async (root, args) =>
      Station.find({}).skip(args.offset).limit(args.limit),
    singleStation: async (root, args) => Station.findById(args.id),
    allTrips: async (root, args) => {
      // If params are given they are added to the query
      const params = {}
      if (args.departure) params.departureStation = args.departure
      if (args.return) params.returnStation = args.return
      // Date param should be given with 00:00:000 time to calculate start and end correctly
      if (args.date) {
        const dateMin = new Date(args.date)
        const dateMax = new Date(dateMin.getTime() + 86400000)
        params.departure = {
          $gte: dateMin,
          $lt: dateMax,
        }
      }
      // Query is sorted and can be limited
      return Trip.find(params).sort({ departure: -1 }).limit(args.limit)
    },
    latestTrips: async (root, args) =>
      Trip.find().sort({ departure: -1 }).limit(args.limit),
    stationStats: async (root, args) => {
      // All trips with this departure station are queried
      const departureTrips = await Trip.find({
        departureStation: args.id,
      })
      // All trips with this return stations are queried
      const returnTrips = await Trip.find({ returnStation: args.id })

      // Stats are calculated and returned
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
      // Station is retrieved from dataloader
      const station = await context.stationsLoader.load(root.departureStation)
      return {
        id: station.id,
        nimi: station.nimi,
        number: station.number,
        osoite: station.osoite,
        kaupunki: station.kaupunki,
      }
    },
    returnStation: async (root, args, context) => {
      // Station is retrieved from dataloader
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
