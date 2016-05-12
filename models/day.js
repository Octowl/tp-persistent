var Sequelize = require('sequelize');
var db = require('./_db');


var Day = db.define('day', {
  num: {
      type: Sequelize.INTEGER,
      allowNull: false
  }
});

module.exports= Day; 
