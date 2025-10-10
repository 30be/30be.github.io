const express = require("express");
const favicon = require("serve-favicon");
const morgan = require("morgan");
const serveStatic = require("serve-static");
var rfs = require("rotating-file-stream"); // version 2.x

const path = require("path");
console.log("server started!");

const app = express();

// create a rotating write stream
var accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "log"),
});

// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

//setup favicon
app.use(favicon(path.join(__dirname, "output/bin", "favicon.ico")));

app.use(serveStatic("output"));
app.use("model-resource", (req, res, next) => {
  res.status(404).send("model was requested"); // Strange; shouldnt happen

  next();
});
app.listen(80);
