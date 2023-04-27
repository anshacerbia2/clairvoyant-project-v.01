"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AirportList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AirportList.init(
    {
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { message: "Type is required." },
          notEmpty: { message: "Type is required." },
        },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { message: "City is required." },
          notEmpty: { message: "City is required." },
        },
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { message: "Country is required." },
          notEmpty: { message: "Country is required." },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { message: "Airport Name is required." },
          notEmpty: { message: "Airport Name is required." },
        },
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { message: "City/IATA code is required." },
          notEmpty: { message: "City/IATA code is required." },
        },
      },
    },
    {
      sequelize,
      modelName: "AirportList",
    }
  );
  return AirportList;
};
