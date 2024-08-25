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
exports.signup = asyncHandler(async (req, res, next) => {
  console.log("=======================================");
  const adminCheck = await req.db.users.findOne({
    where: { role: "superman" },
  });
  if (!adminCheck && req.body.dev == true) {
    const user = await req.db.users.create({
      role: "superman",
      first_name: "Baaskaa",
      last_name: "Purev",
      city: "Ulaangom",
      province: "Demo",
      register: "ОМ01251811",
      email: "itworkllcompany@gmail.com",
      position: "demo",
      phone_number: "99455432",
      password: "Baaskaa20010518",
    });
    if (!user) {
      throw new MyError("Бүртгэж чадсангүй");
    }
    res.status(200).json({
      message: "",
      body: { token: user.getJsonWebToken(), user: user },
    });
  }
  res.status(200).json({
    message: "",
    body: { success: false },
  });
});
