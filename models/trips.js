// mongoose schema for biketrips; departure and return stations are refrenced
const mongoose = require('mongoose')

const tripSchema = new mongoose.Schema({
  departure: Date,
  return: Date,
  departureStation: { type: mongoose.Schema.Types.ObjectId, ref: 'Station' },
  returnStation: { type: mongoose.Schema.Types.ObjectId, ref: 'Station' },
  distance: Number,
  duration: Number,
})

// Cleans, simplifies and parses returned query objects
tripSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Trip', tripSchema)
