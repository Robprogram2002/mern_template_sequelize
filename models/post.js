"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      this.belongsTo(User);
    }
  }
  Post.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        required: true,
        unique: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        required: true,
        validate: {
          min: 4,
        },
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Post",
      tableName: "posts",
      timestamps: true,
    }
  );
  return Post;
};
