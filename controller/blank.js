const sequelize = require("sequelize");
const asyncHandler = require("../middleware/asyncHandle");
const MyError = require("../utils/myError");
const paginate = require("../utils/paginate-sequelize");
exports.create = asyncHandler(async (req, res, next) => {
  const client = await req.db.clients.findByPk(req.id);
  const user = await req.db.users.findByPk(client.userId);
  if (!client.is_active || !user.is_active || client.is_active == false) {
    throw new MyError("Таны эрх хаагдсан байна");
  }
  const blank = await req.db.blank.create(req.body);
  if (!blank) {
    throw new MyError("Бланк нэмэх явцад алдаа гарлаа", 400);
  }

  res.status(200).json({
    message: "",
    body: { success: true },
  });
});

exports.removeBlank = asyncHandler(async (req, res, next) => {
  let blank = await req.db.blank.findByPk(req.params.id);
  if (!blank) {
    throw new MyError(`${req.params.id} id тэй blank олдсонгүй.`, 400);
  }
  await blank.destroy();
  res.status(200).json({
    message: "",
    body: { success: true },
  });
});

exports.getAllBlanks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  let select = req.query.select;

  if (select) {
    select = select.split(" ");
  }

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, req.db.blank);

  let query = { offset: pagination.start - 1, limit };

  if (req.query) {
    query.where = req.query;
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

  const blanks = await req.db.blank.findAll(query);

  res.status(200).json({
    message: "",
    body: { items: blanks, total: blanks.length, pagination },
  });
});

exports.getClientBlanks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  let select = req.query.select;

  if (select) {
    select = select.split(" ");
  }

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, req.db.blank);
  ``;
  let query = { offset: pagination.start - 1, limit };

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

  const blanks = await req.db.blank.findAll({
    ...query,
    include: {
      model: req.db.order_item,
    },
  });
  res.status(200).json({
    message: "",
    body: { items: blanks, total: blanks.length, pagination },
  });
});

exports.updateBlanks = asyncHandler(async (req, res, next) => {
  if (!req.params.id) {
    throw new MyError("Мэдээлэл олдсонгүй", 404);
  }
  await req.db.blank.update(req.body, {
    where: {
      id: req.params.id,
    },
  });

  res.status(200).json({
    message: "",
    body: { success: true },
  });
});
