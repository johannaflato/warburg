const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cleanStack = require('clean-stack');

// loads variables in `.env` file into `process.env` global
require('dotenv').config()

const index = require('./routes/index');
const channels = require('./routes/channels');
const blocks = require('./routes/blocks');

const helpers = require('./middleware/helpers');

const app = express();

// Setup views
app
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs');

// Mount middleware
app
  .use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
  .use(logger('dev'))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(cookieParser())
  .use(express.static(path.join(__dirname, 'public')))
  .use(helpers);

// Mount routers
app
  .use('/', index)
  .use('/channels', channels)
  .use('/blocks', blocks);

// Catches 404 and forwards to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.error.stack = cleanStack(err.stack, { pretty: true, })
  res.locals.status = status;
  res.status(status);
  res.render('error');
});

module.exports = app;
