const fs = require("fs");
const Sequelize = require("sequelize");
const path = require("path");

const sequelize = new Sequelize(
  process.env.DB_TEST_DBNAME,
  process.env.DB_TEST_USER,
  process.env.DB_TEST_PASSWORD,
  { dialect: "postgres" }
);

const db = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== "index.js" && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((model) => {
  if (db[model].associate) db[model].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
