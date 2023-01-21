const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema({
  number: Number,
  nimi: String,
  namn: String,
  name: String,
  osoite: String,
  adress: String,
  kaupunki: String,
  stadt: String,
  operator: String,
  capacity: Number,
  lat: Number,
  long: Number,
});

stationSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Station", stationSchema);
