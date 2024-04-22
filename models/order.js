module.exports = function (sequelize, DataTypes) {
  const Order = sequelize.define(
    "order",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      pay_status: {
        type: DataTypes.ENUM,
        defaultValue: "nopaid",
        values: ["paid", "underpaid", "nopaid"],
      },
      status: {
        type: DataTypes.ENUM,
        defaultValue: "request",
        values: ["request", "printed", "received"],
      },
      total_price: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      is_fast: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      order_number: {
        type: DataTypes.STRING,
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
      received_name: {
        type: DataTypes.STRING,
      },
      received_phone: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "order",
      timestamps: true,
    }
  );

  return Order;
};
