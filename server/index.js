require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const privateRouter = require('./routes/private-router');
const publicRouter = require('./routes/public-router');
const checkJwt = require('./services/jwt');
const db = require('./models')

const app = express();
const SERVER_PORT = process.env.SERVER_PORT || 3005;

db.sequelize.sync(); //{force: true}

const corsConfig = {
  origin: process.env.CLIENT_HOST,
  credentials: true,
}

app.use(morgan('dev'));
app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json());

app.use(publicRouter);
app.use(checkJwt);
app.use(privateRouter);

app.listen(SERVER_PORT, (err) => {
  if (err) {
    console.log(`😞 Sorry, something went wrong! ${err}`); // eslint-disable-line no-console
  } else {
    console.log(`🎉 Server is listening on http://localhost:${SERVER_PORT}`); // eslint-disable-line no-console
  }
});