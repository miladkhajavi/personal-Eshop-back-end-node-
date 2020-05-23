var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
var session = require("express-session");
const config = require("./config/config");
const Logger = require('./app/middleware/logger')
var apiRouter = require("./app/routes/api");
var userRouter = require("./app/routes/user");
var categoryRouter = require("./app/routes/category");
var productRouter = require("./app/routes/product");
var shareRouter = require("./app/routes/share");
var commentRouter = require("./app/routes/comment");
var articleRouter = require("./app/routes/article");
const passport = require("passport");
require("./app/passport/passport")(passport);

var app = express();

mongoose.createConnection("mongodb://localhost/Eshop", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
// header
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(Logger.daily)

app.use("/api", apiRouter);
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/share", shareRouter);
app.use("/api/comment", commentRouter);
app.use("/api/article", articleRouter);

app.listen(config.port || process.env.port || 3000, function () {
  console.log(` ****** running on :  port ${config.port} ******`);
});
module.exports = app;
