const http = require("http");
const fs = require("fs");
require("dotenv").config();

const express = require("express");
const multer = require("multer");
const csv = require("fast-csv");

const Station = require("./models/station");

const router = require("express").Router();
const app = express();

const mongoose = require("mongoose");
const mongoUrl = process.env.MONGODB_URI;

console.log("Connecting to database...");
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

const upload = multer({ dest: "tmp/csv/" });

const validateStationData = (data) => {
  const dataRows = data.slice(1, data.length);
  const stations = dataRows.filter((row, ind, arr) => {
    return ind === arr.findIndex((e) => e[1] === row[1]);
  });
  // console.log(stations);
  return stations;
};

const storeStationData = async (data) => {
  const stationObjects = data.map((row) => {
    return {
      number: row[1],
      nimi: row[2],
      namn: row[3],
      name: row[4],
      osoite: row[5],
      adress: row[6],
      kaupunki: row[7],
      stadt: row[8],
      operator: row[9],
      capacity: row[10],
      lat: row[11],
      long: row[12],
    };
  });
  await Station.deleteMany({});
  const savedStations = await Station.insertMany(stationObjects);
  console.log(savedStations.length);
  return savedStations;
};

router.post("/", upload.single("file"), (req, res) => {
  const fileRows = [];
  // console.log(req.file.path);
  csv
    .parseFile(req.file.path)
    .on("data", (data) => {
      fileRows.push(data);
    })
    .on("end", () => {
      fs.unlinkSync(req.file.path);
      const validatedStations = validateStationData(fileRows);
      const savedStations = storeStationData(validatedStations);
      console.log(savedStations);
      res.status(201).json({
        "Valid stations": validatedStations.length,
        "Saved stations": savedStations.length,
      });
    });
});

app.use("/upload-csv", router);

const PORT = process.env.PORT;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
