require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();
const SERVER_PORT = process.env.SERVER_PORT || 3005;

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('*', (req, res) => {
  res.status(404).send('Sorry, not found 😞')
});

app.listen(SERVER_PORT, (err) => {
  if (err) {
    console.log(`😞 Sorry, something went wrong! ${err}`); // eslint-disable-line no-console
  } else {
    console.log(`🎉 Server is listening on http://localhost:${SERVER_PORT}`); // eslint-disable-line no-console
  }
});