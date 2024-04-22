module.exports = function (sequelize, DataTypes) {
  const OrderItem = sequelize.define(
    "order_item",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      blankId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "blank",
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
    },
    {
      tableName: "order_item",
      timestamps: true,
    }
  );

  return OrderItem;
};
