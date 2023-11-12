"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
<<<<<<< HEAD

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];



=======
<<<<<<< HEAD
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
=======
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
>>>>>>> 3413891fc6e1c31f0e6ec744cee1f54190acb65c
>>>>>>> 546562d79de5dbd8e8fdd885cbb63056eaa85c07
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
