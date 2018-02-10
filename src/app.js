// @ts-nocheck
const debug = require('debug')('app4');
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const sassMiddleware = require('node-sass-middleware');
const session = require('express-session');
const uuid = require('uuid/v4');
const moment = require('moment');
const methodOverride = require('method-override');
const multer = require('multer');
const errorHandler = require('errorhandler');
const helmet = require('helmet');

const FileStore = require('session-file-store')(session);

/***
 *  Config new Express app instance.
 *  with Handlebars as template engine
 */
const app = express();
// @ts-ignore
const hbs = exphbs.create({
  defaultLayout: 'main',
  // these two may be the defaults
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials')
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// middleware
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
app.use(logger('dev'));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(multer());
app.use(cookieParser());

// Need to VERIFY this Sass functionality!
app.use(
  sassMiddleware({
    src: path.join(__dirname, '../public'),
    dest: path.join(__dirname, '../public'),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true
  })
);
app.use(express.static(path.join(__dirname, '../public')));

app.use(
  session({
    genid: req => {
      console.log('Inside the session middleware');
      console.log(req.sessionID);
      return uuid(); // use UUIDs for session IDs
    },
    // @ts-ignore
    store: new FileStore(),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  })
);

// only when process.env.NODE_ENV === "development"
if (app.get('env') === 'development') {
  app.use(errorHandler());
}

// only when process.env.NODE_ENV === "production"
if (app.get('env') === 'production') {
  app.use(helmet());
  app.enable('view cache');
}

/**
 * Async/Await middleware once anything non-trivial should be add
 *
 * see: https://github.com/Abazhenov/express-async-handler
 * and: https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016
 *
 */

// setup home index router
const index = require('./routes/index');
app.use('/', index);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  console.log('inside the 404 error handler');
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  console.log('inside the bottom-level error handler');
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log(`Status: ${err.status}`);
  console.log(`Stack [${err.stack}]`);

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: err.status });
});

module.exports = app;
