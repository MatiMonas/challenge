const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define(
    'Characters',
    {
      image: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g,
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          is: /^[a-zA-Z]+$/,
        },
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
          min: 1,
          max: 99,
        },
      },
      weight: {
        type: DataTypes.INTEGER,
      },
      history: {
        type: DataTypes.TEXT,
      },
    },
    {
      timestamps: false,
    },
  );
};
