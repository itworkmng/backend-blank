/* jshint indent: 1 */
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      role: {
        type: DataTypes.ENUM,
        defaultValue: "human",
        values: ["god", "human", "superman"], //"superman"-garaar uguh
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
      checker_id: { type: DataTypes.INTEGER },
      company_register: {
        type: DataTypes.INTEGER,
      },
      company_name: { type: DataTypes.STRING },
      register: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      acc_number: {
        type: DataTypes.STRING,
      },
      acc_name: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      phone_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,

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
    },
    {
      tableName: "users",
      timestamps: true,
    }
  );
  User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  });

  User.beforeUpdate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  });

  // Generate JWT
  User.prototype.getJsonWebToken = function () {
    const token = jwt.sign(
      {
        id: this.id,
        email: this.email,
        role: this.role,
      },
      process.env.JWT_SECRET
    );
    return token;
  };

  // Check password
  User.prototype.CheckPass = async function (pass) {
    return await bcrypt.compare(pass, this.password);
  };

  User.prototype.generatePasswordChangeToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
  };

  return User;
};
