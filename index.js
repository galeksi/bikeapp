const http = require("http");
const fs = require("fs");
require("dotenv").config();

const express = require("express");
const multer = require("multer");
const csv = require("fast-csv");

const router = require("express").Router();
const app = express();

const upload = multer({ dest: "tmp/csv/" });

router.post("/", upload.single("file"), (req, res) => {
  const fileRows = [];
  console.log(req.file);
  csv
    .parseFile(req.file.path)
    .on("data", (data) => {
      fileRows.push(data); // push each row
    })
    .on("end", () => {
      console.log(fileRows); //contains array of arrays. Each inner array represents row of the csv file, with each element of it a column
      fs.unlinkSync(req.file.path); // remove temp file
      //process "fileRows" and respond
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
