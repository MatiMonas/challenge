const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define(
    'Movies',
    {
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      releaseDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          is: /^[1-5]$/,
        }
      },
      genreId: {
        type: DataTypes.INTEGER,
        foreignKey: true
      },
    },
    {
      timestamps: false,
    },
  );
};
