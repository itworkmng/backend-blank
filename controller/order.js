const { Op } = require("sequelize");
const asyncHandler = require("../middleware/asyncHandle");
const { generateLengthPass } = require("../utils/functions");
const MyError = require("../utils/myError");
const sendEmail = require("../utils/email");
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { order_item, is_fast } = req.body;
  const client = await req.db.clients.findByPk(req.id);
  const user = await req.db.users.findByPk(client.userId);

  if (!client.is_active || client.is_active == false || !user.is_active) {
    throw new MyError("Таны эрх хаагдсан байна");
  }
  if (!order_item || !client) {
    throw new MyError("Захиалга Бүртгэж чадсангүй");
  }
  const orderBody = {
    is_fast,
    clientId: client.id,
    userId: client.userId,
    order_number: client.id + "" + generateLengthPass(7),
  };
  const order = await req.db.order.create(orderBody);
  await order_item.map(async (item) => {
    await req.db.order_item.create({
      quantity: item.quantity || 0,
      blankId: item.blankId,
      orderId: order.id,
    });
  });
  const message = `<b>Сайн байна уу?</b><br>
  Танд “${client.company_name}”-с шинээр захиалга ирлээ.<br>
  Өдрийг сайхан өнгөрүүлээрэй!<br>
  <a href="www.itwork.mn">www.itwork.mn</a> ©${new Date().getFullYear()} БҮХ ЭРХ ХУУЛИАР ХАМГААЛАГДСАН.`;
  await sendEmail({
    subject: `www.eblank.mn`,
    email: user.email,
    message,
  });
  res.status(200).json({
    message: "",
    body: { success: true },
  });
});
exports.getClientOrder = asyncHandler(async (req, res, next) => {
  const sort = req.query.sort;
  let select = req.query.select;

  if (select) {
    select = select.split(" ");
  }

  ["select", "sort"].forEach((el) => delete req.query[el]);

  let query = {};

  if (req.query) {
    query.where = { ...req.query, clientId: req.id };
  }

  if (select) {
    query.attributes = select;
  }

  if (sort) {
    query.order = sort
      .split(" ")
      .map((el) => [
        el.charAt(0) === "-" ? el.substring(1) : el,
        el.charAt(0) === "-" ? "ASC" : "DESC",
      ]);
  }

  const orders = await req.db.order.findAll({
    ...query,
    include: [
      {
        model: req.db.payment,
      },
    ],
  });
  res.status(200).json({
    message: "",
    body: { items: orders, total: orders.length },
  });
});
exports.getOrders = asyncHandler(async (req, res, next) => {
  const sort = req.query.sort;
  let select = req.query.select;

  if (select) {
    select = select.split(" ");
  }

  ["select", "sort"].forEach((el) => delete req.query[el]);

  let query = {};

  if (req.query) {
    if (req.role == "human") {
      query.where = {
        ...req.query,
        userId: req.id,
      };
    } else if (req.role == "god") {
      const findUser = await req.db.users.findByPk(req.id);
      query.where = {
        ...req.query,
        userId: findUser.checker_id,
        status: { [Op.ne]: "request" },
      };
    }
  }

  if (select) {
    query.attributes = select;
  }

  if (sort) {
    query.order = sort
      .split(" ")
      .map((el) => [
        el.charAt(0) === "-" ? el.substring(1) : el,
        el.charAt(0) === "-" ? "ASC" : "DESC",
      ]);
  }
  const orders = await req.db.order.findAll({
    ...query,
    include: [
      {
        model: req.db.payment,
      },
    ],
  });
  const order_items = [];
  for (const order of orders) {
    const client = await req.db.clients.findByPk(order.clientId);
    order_items.push({ ...order.toJSON(), client });
  }
  res.status(200).json({
    message: "",
    body: { items: order_items, total: orders.length },
  });
});

exports.getOrdersUnPaid = asyncHandler(async (req, res, next) => {
  const sort = req.query.sort;
  let select = req.query.select;

  if (select) {
    select = select.split(" ");
  }

  ["select", "sort"].forEach((el) => delete req.query[el]);

  let query = {};

  if (req.query) {
    query.where = {
      ...req.query,
      userId: req.id,
      pay_status: { [Op.ne]: "paid" },
    };
  }

  if (select) {
    query.attributes = select;
  }

  if (sort) {
    query.order = sort
      .split(" ")
      .map((el) => [
        el.charAt(0) === "-" ? el.substring(1) : el,
        el.charAt(0) === "-" ? "ASC" : "DESC",
      ]);
  }
  if (req.role == "human") {
    const orders = await req.db.order.findAll({
      ...query,
      include: [
        {
          model: req.db.payment,
        },
      ],
    });
    const order_items = [];
    for (const order of orders) {
      const client = await req.db.clients.findByPk(order.clientId);
      order_items.push({ ...order.toJSON(), client });
    }
    res.status(200).json({
      message: "",
      body: { items: order_items, total: orders.length },
    });
  }
});
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await req.db.order.findByPk(req.params.id, {
    include: [
      {
        model: req.db.order_item,
      },
    ],
  });

  const order_items = [];
  for (const item of order.order_items) {
    const blank = await req.db.blank.findByPk(item.blankId);
    order_items.push({ ...item.toJSON(), blank });
  }
  const client = await req.db.clients.findByPk(order.clientId);
  res.status(200).json({
    message: "",
    body: { ...order.toJSON(), order_items, client },
  });
});
exports.getClientUnPaidOrder = asyncHandler(async (req, res, next) => {
  const sort = req.query.sort;
  let select = req.query.select;

  if (select) {
    select = select.split(" ");
  }

  ["select", "sort"].forEach((el) => delete req.query[el]);

  let query = {};

  if (req.query) {
    query.where = {
      ...req.query,
      clientId: req.id,
      pay_status: { [Op.ne]: "paid" },
    };
  }

  if (select) {
    query.attributes = select;
  }

  if (sort) {
    query.order = sort
      .split(" ")
      .map((el) => [
        el.charAt(0) === "-" ? el.substring(1) : el,
        el.charAt(0) === "-" ? "ASC" : "DESC",
      ]);
  }

  const orders = await req.db.order.findAll({
    ...query,
    include: [
      {
        model: req.db.payment,
      },
    ],
  });
  res.status(200).json({
    message: "",
    body: { items: orders, total: orders.length },
  });
});
exports.removerOrder = asyncHandler(async (req, res, next) => {
  const orderId = req.params.id;
  // order, order_item find remove sequilize
  const order = await req.db.order.findOne({
    where: {
      id: orderId,
      clientId: req.id,
      status: "request",
    },
  });
  if (!order) {
    throw new MyError("Устгах боломжгүй байна!!");
  }
  await order.destroy();
  res.status(200).json({
    message: "",
    body: { success: true },
  });
});

exports.updateOrder = asyncHandler(async (req, res, next) => {
  const orderId = req.params.id;
  const {
    order_items,
    status,
    total_price,
    received_name = "",
    received_phone = "",
  } = req.body;
  // Check is db
  const user = async () => {
    if (req.role == "god") {
      const god = await req.db.users.findByPk(req.id);
      const user = await req.db.users.findByPk(god.checker_id);
      if (!user.is_active) {
        throw new MyError("Таны эрх хаагдсан байна");
      }
      return user;
    }
    if (!user.is_active) {
      throw new MyError("Таны эрх хаагдсан байна");
    }
    return await req.db.users.findByPk(req.id);
  };

  const order = await req.db.order.findByPk(orderId, {
    where: {
      userId: user.id,
    },
  });
  // Check success full done

  // find client
  const client = await req.db.clients.findByPk(order.clientId);

  // Order items updateing
  if (order_items && order) {
    await order_items.map(async (item) => {
      await req.db.order_item.update(item, {
        where: {
          id: item.id,
        },
      });
    });
    if (status) {
      await req.db.order.update(
        { status },
        {
          where: {
            id: orderId,
          },
        }
      );
      if (status == "printed") {
        const message = `<b>Сайн байна уу?</b><br>
  Таны захиалга хэвлэгдсэн.<br>
  Өдрийг сайхан өнгөрүүлээрэй!<br>
  <a href="www.itwork.mn">www.itwork.mn</a> ©${new Date().getFullYear()} БҮХ ЭРХ ХУУЛИАР ХАМГААЛАГДСАН.`;
        await sendEmail({
          subject: `www.eblank.mn`,
          email: client.email,
          message,
        });
      }
    }
    total_price &&
      (await req.db.order.update(
        { total_price },
        {
          where: {
            id: orderId,
          },
        }
      ));
  } else if (!order_items && order) {
    (status || received_name || received_phone) &&
      (await req.db.order.update(
        { status, received_name, received_phone },
        {
          where: {
            id: orderId,
          },
        }
      ));
  }
  res.status(200).json({
    message: "",
    body: { success: true },
  });
});
