// mongoose schema for bike stations
const mongoose = require('mongoose')

const stationSchema = new mongoose.Schema({
  fid: Number,
  number: { type: Number, required: true },
  nimi: { type: String, required: true },
  namn: String,
  name: String,
  osoite: { type: String, required: true },
  adress: String,
  kaupunki: { type: String, required: true },
  stad: String,
  operator: String,
  capacity: { type: Number, required: true },
  long: Number,
  lat: Number,
})

// Cleans, simplifies and parses returned query objects
stationSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Station', stationSchema)
