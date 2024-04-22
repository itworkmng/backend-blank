module.exports = function (sequelize, DataTypes) {
  const Payment = sequelize.define(
    "payment",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "clients",
          key: "id",
        },
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "order",
          key: "id",
        },
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
      tableName: "payment",
      timestamps: true,
    }
  );

  return Payment;
};
