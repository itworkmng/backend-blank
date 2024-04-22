const asyncHandler = require("../middleware/asyncHandle");
const MyError = require("../utils/myError");
exports.create = asyncHandler(async (req, res, next) => {
  const client = await req.db.clients.findOne({
    where: {
      id: req.body.clientId,
      userId: req.id,
    },
  });
  const order = await req.db.order.findByPk(req.body.orderId, {
    where: {
      clientId: req.id,
    },
  });
  if (!client || !order) {
    throw new MyError("Төлбөр нэмэх үед алдаа гарлаа", 400);
  }
  const payment = await req.db.payment.create(req.body);
  if (!payment) {
    throw new MyError("Төлбөр нэмэх үед алдаа гарлаа", 400);
  }

  const payments = await req.db.payment.findAll({
    where: {
      orderId: req.body.orderId,
    },
  });
  if (payments) {
    let payTotal = 0;
    for (let index = 0; index < payments.length; index++) {
      const pay = payments[index];
      payTotal += pay.price;
    }
    if (order.total_price <= payTotal) {
      await req.db.order.update(
        { pay_status: "paid" },
        {
          where: {
            id: order.id,
          },
        }
      );
    }
  }
  res.status(200).json({
    message: "",
    body: {
      success: true,
    },
  });
});
