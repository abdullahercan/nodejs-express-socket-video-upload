const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const uploadRouter = require("./routes/upload");

const app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

app.use(function (req, res, next) {
  res.io = io;
  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/upload", uploadRouter);

// module.exports = app;
module.exports = { app: app, server: server };
