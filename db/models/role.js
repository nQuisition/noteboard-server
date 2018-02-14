'use strict';
module.exports = (sequelize, DataTypes) => {
  var Role = sequelize.define('Role', {
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    priority: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });

  Role.associate = (models) => {
    Role.hasMany(models.User, {
      foreignKey: 'roleId',
      as: 'users'
    });
  };

  return Role;
};