const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define(
    'Genres',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      image: {
        type: DataTypes.BLOB(),
        allowNull: true,
      }
    },
    {
      timestamps: false,
    },
  );
};
