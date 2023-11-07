var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fileupload = require("express-fileupload");
const { v4: uuidv4 } = require('uuid');
const Swal = require('sweetalert2');
const { Validator } = require('node-input-validator');
var flash = require('express-flash');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
require('dotenv').config();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(fileupload());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 365 * 1000,
  },
}));
app.use(flash());

main().catch(err => console.log(err));

async function main() {
  console.log("db connected")
  await mongoose.connect(process.env.MONGO_URI);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const PORT = process.env.PORT || 4111
app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`)
})

module.exports = app;
