/* jshint indent: 1 */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
module.exports = function (sequelize, DataTypes) {
  const Client = sequelize.define(
    "clients",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      photo: {
        type: DataTypes.STRING,
        defaultValue: "empty.png",
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      province: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      company_register: {
        type: DataTypes.INTEGER,
      },
      company_name: { type: DataTypes.STRING },
      company_phone_number: { type: DataTypes.STRING, unique: true },
      company_email: { type: DataTypes.STRING, unique: true },
      social_address: {
        type: DataTypes.STRING,
      },
      register: {
        type: DataTypes.STRING,
        unique: true,
      },
      phone_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: {
            msg: "Email is required",
          },
        },
      },
      position: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      expire_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Та нууц үгээ оруулна уу",
          },
          len: {
            args: [4, 100],
            msg: "Таны нууц үг хэт богино байна",
          },
        },
        select: false,
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
      },

      resetPasswordExpire: {
        type: DataTypes.DATE,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      tableName: "clients",
      timestamps: true,
    }
  );
  Client.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  });

  // Generate JWT
  Client.prototype.getJsonWebToken = function () {
    const token = jwt.sign(
      {
        id: this.id,
        email: this.email,
      },
      process.env.JWT_SECRET
    );
    return token;
  };
  // Check password
  Client.prototype.CheckPass = async function (pass) {
    return await bcrypt.compare(pass, this.password);
  };
  Client.prototype.generatePasswordChangeToken = function () {};
  return Client;
};
