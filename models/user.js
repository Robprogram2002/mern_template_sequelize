"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Post }) {
      // define association here
      this.hasMany(Post, { foreignKey: "userId", as: "posts" });
    }

    toJSON() {
      return {
        ...this.get(),
        id: undefined,
      };
    }
  }
  User.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        required: true,
        unique: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        required: true,
        validate: {
          isEmail: { message: "Please enter a valid email address" },
        },
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        required: true,
        validate: {
          min: 6,
          max: 30,
        },
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        required: true,
        validate: {
          min: 3,
        },
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        values: ["user", "suspended", "cancel", "deleded", "admin"],
        allowNull: false,
        defaultValue: "user",
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: "User",
      tableName: "users",
    }
  );
  return User;
};
