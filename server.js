const express = require("express");
const app = express();
// const port = process.env.PORT || 0; // for dynemically chaging the port
const port = process.env.PORT || 8000;
const bodyParser = require("body-parser");
const path = require("path");
const mongo = require("./database/dbConfig");
const cors = require("cors");

// midilwear to parse the body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

// public path
app.use(express.static(path.join(__dirname, "public")));
app.set("views", "./src/public");

//set up the view engine
app.set("view engine", "pug");
app.set("views", "views");

// PUT Server ON sleep
// app.use((req, res, next) => {  res.render('maintenance')})

// set uploads as static

app.use("/upload", express.static(path.join(__dirname, "upload")));

// requiring the routes
app.use("/api/", require("./server/routes"));

app.use(express.static("frontEnd/build"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontEnd", "build", "index.html"));
});

app.listen(port, () => {
  //console.log("Server is running at port", port);
  // //console.log(app.address());
});
