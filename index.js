const http = require("http");
const fs = require("fs");
require("dotenv").config();

const express = require("express");
const multer = require("multer");
const csv = require("fast-csv");

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

const validateStationData = (rows) => {
  const dataRows = rows.slice(1, rows.length);
  const stations = dataRows.filter((row, ind, arr) => {
    return ind === arr.findIndex((e) => e[1] === row[1]);
  });
  // console.log(stations);
  return stations;
};

router.post("/", upload.single("file"), (req, res) => {
  const fileRows = [];
  const validatedRows = [];
  // console.log(req.file.path);
  csv
    .parseFile(req.file.path)
    .on("data", (data) => {
      fileRows.push(data);
    })
    .on("end", () => {
      fs.unlinkSync(req.file.path);
      const validatedStations = validateStationData(fileRows);
      validatedRows.concat(validatedStations);
      res.status(201).json({
        "Valid stations": validatedStations.length,
      });
    });
});

app.use("/upload-csv", router);

app.use(function (err, req, res, next) {
  console.log("This is the invalid field ->", err.field);
  next(err);
});

const PORT = process.env.PORT;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
