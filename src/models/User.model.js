const { DataTypes } = require('sequelize');
import { hashPassword } from '../common/utils';

module.exports = (sequelize) => {
  return sequelize.define(
    'Users',
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value){
          this.setDataValue('password', hashPassword(value))
        }
      }
    },
    {
      timestamps: false,
    },
  );
};
