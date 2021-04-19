const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cleanStack = require('clean-stack');

const router = express.Router();

// loads variables in `.env` file into `process.env` global
require('dotenv').config()
if (!process.env.ARENA_CHANNEL_ID) {
  throw new Error('ARENA_CHANNEL_ID env var not set.')
}

const index = require('./routes/index');
const channels = require('./routes/channels');
const block = require('./routes/block');

const helpers = require('./middleware/helpers');
const definitions = require('./middleware/definitions');
const mainchannels = require('./middleware/mainchannels');

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
  .use(helpers)
  // add current or matched definition to template res.locals
  .use(definitions)
  // add main channels to template res.locals
  .use(mainchannels);

// Setup view router
router
  .use('/', index)
  .use('/channels', channels)
  .use('/block', block); 

// Mount router routes twice, once at the root level
// and once under a slug for the definition version/block-id
app
  .use('/', router)
  .use('/:definition(\\d+)', router) // :definition(\\d+) matches one or more digits

// Catches 404 and forwards to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.locals.error = {};
  if (process.env.NODE_ENV !== 'production') {
    res.locals.error =  err;
    res.locals.error.stack = cleanStack(err.stack, { pretty: true, })
  }
  res.locals.status = status;
  res.status(status);
  res.render('error');
});

module.exports = app;
