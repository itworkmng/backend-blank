const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const asyncHandler = require("../middleware/asyncHandle");
const MyError = require("../utils/myError");
const sendEmail = require("../utils/email");
const { generateLengthPass } = require("../utils/functions");

exports.getUserClients = asyncHandler(async (req, res, next) => {
  const sort = req.query.sort;
  let select = req.query.select;

  if (select) {
    select = select.split(" ");
  }

  ["select", "sort"].forEach((el) => delete req.query[el]);

  let query = {};

  if (req.query) {
    query.where = { ...req.query, userId: req.params.id };
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

  const users = await req.db.clients.findAll(query);
  res.status(200).json({
    message: "",
    body: { items: users, total: users.length },
  });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  await req.db.users.update(req.body, {
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json({
    message: "",
    body: { success: true },
  });
});

exports.removeUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const user = await req.db.users.findByPk(userId);
  await user.destroy();

  res.status(200).json({
    message: "",
    body: { success: true },
  });
});

exports.updateClient = asyncHandler(async (req, res, next) => {
  const userId = req.id;
  const clientId = req.params.id;
  if (req.role == "superman") {
    await req.db.clients.update(req.body, {
      where: {
        id: clientId,
      },
    });
  } else if (req.role == "god") {
    const god = await req.db.users.findByPk(req.id);
    if (!god) {
      throw new MyError("Хэвлэгчтэй холбогдохгүй байна", 404);
    }
    if (!god.is_active) {
      throw new MyError("Таны эрх хаагдсан байна");
    }
    await req.db.clients.update(req.body, {
      where: {
        id: clientId,
        userId: god.checker_id,
      },
    });
  } else if (req.role == "human") {
    const user = await req.db.users.findByPk(userId);
    if (!user.is_active) {
      throw new MyError("Таны эрх хаагдсан байна");
    }
    await req.db.clients.update(req.body, {
      where: {
        id: clientId,
        userId: userId,
      },
    });
  } else {
    await req.db.clients.update(req.body, {
      where: {
        id: clientId,
      },
    });
  }
  res.status(200).json({
    message: "",
    body: { success: true },
  });
});

exports.removeClient = asyncHandler(async (req, res, next) => {
  const userId = req.id;
  const clientId = req.params.id;
  if (req.role == "superman") {
    const client = await req.db.clients.findOne(req.body, {
      where: {
        id: clientId,
      },
    });
    await client.destroy();
  } else if (req.role == "god") {
    const god = await req.db.users.findByPk(req.id);
    if (!god) {
      throw new MyError("Хэвлэгчтэй холбогдохгүй байна", 404);
    }
    const client = await req.db.clients.findOne(req.body, {
      where: {
        id: clientId,
        userId: god.checker_id,
      },
    });
    await client.destroy();
  } else {
    const client = await req.db.clients.findOne(req.body, {
      where: {
        id: clientId,
        userId,
      },
    });
    await client.destroy();
  }

  res.status(200).json({
    message: "",
    body: { success: true },
  });
});

exports.getUsers = asyncHandler(async (req, res, next) => {
  const sort = req.query.sort;
  let select = req.query.select;

  if (select) {
    select = select.split(" ");
  }

  ["select", "sort"].forEach((el) => delete req.query[el]);

  let query = {};

  if (req.query) {
    query.where = { ...req.query, role: { [Op.ne]: "superman" } };
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

  const users = await req.db.users.findAll(query);
  res.status(200).json({
    message: "",
    body: { items: users, total: users.length },
  });
});

exports.getPrintUsers = asyncHandler(async (req, res, next) => {
  const sort = req.query.sort;
  let select = req.query.select;

  if (select) {
    select = select.split(" ");
  }

  ["select", "sort"].forEach((el) => delete req.query[el]);

  let query = {};

  if (req.query) {
    query.where = { ...req.query, role: "human" };
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

  const users = await req.db.users.findAll(query);
  res.status(200).json({
    message: "",
    body: { items: users, total: users.length },
  });
});

exports.getControlUsers = asyncHandler(async (req, res, next) => {
  const sort = req.query.sort;
  let select = req.query.select;

  if (select) {
    select = select.split(" ");
  }

  ["select", "sort"].forEach((el) => delete req.query[el]);

  let query = {};

  if (req.query) {
    query.where = { ...req.query, role: "god" };
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

  const users = await req.db.users.findAll(query);
  res.status(200).json({
    message: "",
    body: { items: users, total: users.length },
  });
});

exports.signin = asyncHandler(async (req, res, next) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    throw new MyError("Имейл эсвэл нууц үгээ оруулна уу", 400);
  }
  const user = await req.db.users.findOne({
    where: { phone_number: phone },
  });
  if (!user) {
    throw new MyError("Мэдээлэл буруу байна", 400);
  }

  const ok = await user.CheckPass(password);
  if (!ok) {
    throw new MyError("Мэдээлэл буруу байна", 400);
  }
  res.status(200).json({
    message: "",
    body: { token: user.getJsonWebToken(), user: user },
  });
});
exports.adminsignin = asyncHandler(async (req, res, next) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    throw new MyError("Имейл эсвэл нууц үгээ оруулна уу", 400);
  }
  const user = await req.db.users.findOne({
    where: { phone_number: phone, role: "superman" },
  });
  if (!user) {
    throw new MyError("Мэдээлэл буруу байна", 400);
  }

  const ok = await user.CheckPass(password);
  if (!ok) {
    throw new MyError("Мэдээлэл буруу байна", 400);
  }
  res.status(200).json({
    message: "",
    body: { token: user.getJsonWebToken(), user: user },
  });
});
exports.signup = asyncHandler(async (req, res, next) => {
  console.log(req.role);
  const password = generateLengthPass(6);
  if (req.body.role == "god" && !req.body.checker_id) {
    throw new MyError("Хэвлэгчийг сонгоно уу");
  }
  if (req.body.role == "god") {
    const findPrinter = await req.db.users.findByPk(req.body.checker_id, {
      where: {
        role: "human",
      },
    });
    if (!findPrinter) {
      throw new MyError("Хэвлэгчийн мэдээлэл олдсонгүй");
    }
  }
  const user = await req.db.users.create({ ...req.body, password });
  if (!user) {
    throw new MyError("Бүртгэж чадсангүй");
  }

  const message = `<b>Сайн байна уу?</b><br>
  Та “Хэвлэмэл хуудасны захиалга, хяналтын систем”-д дараах эрхээр нэвтрэн орж хэвлэмэл хуудасны захиалгаа өгнө үү.<br>
  Холбоос: <a href="www.eblank.mn">www.eblank.mn</a><br>
  Нэвтрэх нэр: <b>${find_users.phone_number}</b><br>
  Нууц үг: <b>${new_password}</b><br>
  Өдрийг сайхан өнгөрүүлээрэй!<br>
  <a href="www.itwork.mn">www.itwork.mn</a> ©${new Date().getFullYear()} БҮХ ЭРХ ХУУЛИАР ХАМГААЛАГДСАН.`;

  await sendEmail({
    subject: "Нууц үг солигдлоо",
    email: req.body.email,
    message,
  });

  await sendEmail({
    subject: "Нууц үг солигдлоо",
    email: "tsakhimuvs@gmail.com",
    message,
  });

  res.status(200).json({
    message: "",
    body: { token: user.getJsonWebToken(), user: user },
  });
});
exports.getInfo = asyncHandler(async (req, res, next) => {
  const info = await req.db.users.findByPk(req.id);
  if (!req.id || !info) {
    throw new MyError("Мэдээлэл олдсонгүй", 404);
  }

  res.status(200).json({
    message: "",
    body: info,
  });
});
exports.getUser = asyncHandler(async (req, res, next) => {
  const info = await req.db.users.findByPk(req.params.id);
  if (!req.params.id || !info) {
    throw new MyError("Мэдээлэл олдсонгүй", 404);
  }

  res.status(200).json({
    message: "",
    body: info,
  });
});
exports.change_password = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  if (!userId) {
    throw new MyError("хэрэглэгч олдсонгүй!", 400);
  }
  const salt = await bcrypt.genSalt(10);
  const new_password = generateLengthPass(6);
  const password = await bcrypt.hash(new_password, salt);
  await req.db.users.update(
    { password: password },
    {
      where: {
        id: userId,
      },
    }
  );

  const find_users = await req.db.users.findByPk(userId);
  if (!find_users) {
    throw new MyError("Мэдээлэл олдсонгүй", 404);
  }
  const message = `<b>Сайн байна уу?</b><br>
  Та “Хэвлэмэл хуудасны захиалга, хяналтын систем”-д дараах эрхээр нэвтрэн орж хэвлэмэл хуудасны захиалгаа өгнө үү.<br>
  Холбоос: <a href="www.eblank.mn">www.eblank.mn</a><br>
  Нэвтрэх нэр: <b>${find_users.phone_number}</b><br>
  Нууц үг: <b>${new_password}</b><br>
  Өдрийг сайхан өнгөрүүлээрэй!<br>
  <a href="www.itwork.mn">www.itwork.mn</a> ©${new Date().getFullYear()} БҮХ ЭРХ ХУУЛИАР ХАМГААЛАГДСАН.`;
  await sendEmail({
    subject: "Нууц үг солигдлоо",
    email: find_users.email,
    message,
  });

  res.status(200).json({
    message: "",
    body: { success: true },
  });
});
exports.change_password_client = asyncHandler(async (req, res, next) => {
  const clientId = req.params.id;
  if (!clientId) {
    throw new MyError("хэрэглэгч олдсонгүй!", 400);
  }
  const salt = await bcrypt.genSalt(10);
  const new_password = generateLengthPass(6);
  const password = await bcrypt.hash(new_password, salt);
  await req.db.clients.update(
    { password: password },
    {
      where: {
        id: clientId,
        userId: req.id,
      },
    }
  );

  const find_users = await req.db.clients.findByPk(clientId);
  const message = `<b>Сайн байна уу?</b><br>
  Та “Хэвлэмэл хуудасны захиалга, хяналтын систем”-д дараах эрхээр нэвтрэн орж хэвлэмэл хуудасны захиалгаа өгнө үү.<br>
  Компаний нэр: <b>${find_users.company_name}</b><br>
  Холбоос: <a href="www.eblank.mn">www.eblank.mn</a><br>
  Нэвтрэх нэр: <b>${find_users.phone_number}</b><br>
  Нууц үг: <b>${new_password}</b><br>
  Өдрийг сайхан өнгөрүүлээрэй!<br>
  <a href="www.itwork.mn">www.itwork.mn</a> ©${new Date().getFullYear()} БҮХ ЭРХ ХУУЛИАР ХАМГААЛАГДСАН.`;
  await sendEmail({
    subject: "Нууц үг солигдлоо",
    email: find_users.email,
    message,
  });

  res.status(200).json({
    message: "",
    body: { success: true },
  });
});

exports.forgot_password = asyncHandler(async (req, res, next) => {
  const email = req.body.email;
  if (!email) {
    throw new MyError("Хэрэглэгч олдсонгүй!", 400);
  }
  const users = await req.db.users.findOne({
    where: {
      email,
    },
  });
  if (!users) {
    throw new MyError("хэрэглэгч олдсонгүй!", 400);
  }
  const salt = await bcrypt.genSalt(10);
  const new_password = generateLengthPass(6);
  const password = await bcrypt.hash(new_password, salt);
  await req.db.users.update(
    { password },
    {
      where: {
        email,
      },
    }
  );

  const find_users = await req.db.users.findByPk(users.id);
  if (!find_users) {
    throw new MyError("Мэдээлэл олдсонгүй", 404);
  }
  const message = `<b>Сайн байна уу?</b><br>
  Та “Хэвлэмэл хуудасны захиалга, хяналтын систем”-д дараах эрхээр нэвтрэн орж хэвлэмэл хуудасны захиалгаа өгнө үү.<br>
  Холбоос: <a href="www.eblank.mn">www.eblank.mn</a><br>
  Нэвтрэх нэр: <b>${find_users.phone_number}</b><br>
  Нууц үг: <b>${new_password}</b><br>
  Өдрийг сайхан өнгөрүүлээрэй!<br>
  <a href="www.itwork.mn">www.itwork.mn</a> ©${new Date().getFullYear()} БҮХ ЭРХ ХУУЛИАР ХАМГААЛАГДСАН.`;
  await sendEmail({
    subject: "Нууц үг солигдлоо",
    email: find_users.email,
    message,
  });

  res.status(200).json({
    message: "",
    body: { success: true },
  });
});
