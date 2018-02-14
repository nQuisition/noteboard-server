'use strict';
module.exports = (sequelize, DataTypes) => {
  var Note = sequelize.define('Note', {
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
    body: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    ownerId: {
      allowNull: false,
      type: DataTypes.UUID,
      foreignKey: true
    },
    ownerBoardId: {
      allowNull: false,
      type: DataTypes.UUID,
      foreignKey: true
    }
  }, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });

  Note.associate = (models) => {
    Note.belongsTo(models.User, {
      foreignKey: 'ownerId',
      onDelete: 'CASCADE'
    });
    Note.belongsTo(models.Board, {
      foreignKey: 'ownerBoardId',
      onDelete: 'CASCADE'
    });
  };

  return Note;
};