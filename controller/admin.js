const asyncHandler = require("../middleware/asyncHandle");

exports.getCounts = asyncHandler(async (req, res, next) => {
  const order = await req.db.order.count();
  const clients = await req.db.clients.count();
  const users = await req.db.users.count({
    where: {
      role: "human",
    },
  });
  const controller = await req.db.users.count({
    where: {
      role: "god",
    },
  });
  const total_price = await req.db.payment.sum("price");
  res.status(200).json({
    message: "",
    body: {
      controller,
      users,
      clients,
      order,
      total_price,
    },
  });
});

exports.getUserCounts = asyncHandler(async (req, res, next) => {
  const order = await req.db.order.count({
    where: {
      userId: req.params.id,
    },
  });
  const clients = await req.db.clients.count({
    where: { userId: req.params.id },
  });
  const total_price = await req.db.payment.sum("price", {
    where: {
      userId: req.params.id,
    },
  });
  res.status(200).json({
    message: "",
    body: {
      clients,
      order,
      total_price,
    },
  });
});
