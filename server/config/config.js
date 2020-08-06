require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_TEST_USER,
    password: process.env.DB_TEST_PASSWORD,
    database: process.env.DB_TEST_DBNAME,
    host: 'localhost',
    dialect: 'postgres',
  },
};
