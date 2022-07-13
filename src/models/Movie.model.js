const moment = require('moment');
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define(
    'Movies',
    {
      image: {
        type: DataTypes.BLOB(),
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
        get(){
          return moment(this.getDataValue('releaseDate')).format('DD/MM/YYYY');
        }
      },
      rating: {
        type: DataTypes.ENUM(['1', '2', '3', '4', '5']),
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
