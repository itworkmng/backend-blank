/* jshint indent: 1 */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
module.exports = function (sequelize, DataTypes) {
  const Blank = sequelize.define(
    "blank",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "clients",
          key: "id",
        },
      },
    },
    {
      tableName: "blank",
      timestamps: true,
    }
  );

  return Blank;
};
