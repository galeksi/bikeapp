const { gql } = require('graphql-tag')

const typeDefs = gql`
  type Station {
    id: ID!
    fid: Int
    number: Int!
    nimi: String!
    namn: String
    name: String
    osoite: String!
    adress: String
    kaupunki: String!
    stad: String
    operator: String
    capacity: Int!
    long: String
    lat: String
  }
  type Statistics {
    stationId: String
    startTotal: Int
    returnTotal: Int
    startAvg: String
    returnAvg: String
    popularReturn: [String]
    popularDeparture: [String]
  }
  type Trip {
    id: ID!
    departure: String!
    return: String!
    departureStation: Station!
    returnStation: Station!
    distance: Int!
    duration: Int!
  }
  type Query {
    allStations(offset: Int, limit: Int): [Station!]!
    singleStation(id: String): Station!
    stationStats(id: String): Statistics!
    allTrips(
      limit: Int
      departure: String
      return: String
      date: String
    ): [Trip!]!
    latestTrips(limit: Int): [Trip!]!
  }
`
module.exports = typeDefs
