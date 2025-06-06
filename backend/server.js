// server.js
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const indexRouter = require('./routes/index.js');
const usersRouter = require('./routes/users.js');
const moviesRouter = require('./routes/movies.js');
const recommendationsRouter = require('./routes/recommendations.js');
const ratingsRouter = require('./routes/ratings');
const {
  routeNotFoundJsonHandler,
} = require('./services/routeNotFoundJsonHandler.js');
const { jsonErrorHandler } = require('./services/jsonErrorHandler.js');
const { appDataSource } = require('./datasource.js');

dotenv.config();

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/recommendations', recommendationsRouter);
app.use('/ratings', ratingsRouter);

app.use(routeNotFoundJsonHandler);
app.use(jsonErrorHandler);

const port = parseInt(process.env.PORT || '8000');

appDataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
