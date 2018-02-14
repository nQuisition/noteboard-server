'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isAlphanumeric: true
      }
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    },
    roleId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      foreignKey: true
    }
  }, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });

  User.associate = (models) => {
    User.belongsTo(models.Role, {
      foreignKey: 'roleId',
      as: 'role',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.Board, {
      foreignKey: 'ownerId',
      as: 'boards'
    });
    User.hasMany(models.Note, {
      foreignKey: 'ownerId',
      as: 'notes'
    });
  };

  return User;
};