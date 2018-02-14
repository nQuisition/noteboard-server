'use strict';
module.exports = (sequelize, DataTypes) => {
  var Board = sequelize.define('Board', {
    id: {
      allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    def: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    ownerId: {
      allowNull: false,
      type: DataTypes.UUID,
      foreignKey: true
    }
  }, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });

  Board.associate = (models) => {
    Board.belongsTo(models.User, {
      foreignKey: 'ownerId',
      onDelete: 'CASCADE'
    });
    Board.hasMany(models.Note, {
      foreignKey: 'ownerBoardId',
      as: 'notes'
    });
  };

  return Board;
};