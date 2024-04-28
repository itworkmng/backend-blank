const asyncHandler = require("../middleware/asyncHandle");
const sendEmail = require("../utils/email");
const bcrypt = require("bcrypt");
const { generateLengthPass } = require("../utils/functions");
const MyError = require("../utils/myError");
const path = require("path");
const cuid = require("cuid");
exports.signin = asyncHandler(async (req, res, next) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    throw new MyError("Имейл эсвэл нууц үгээ оруулна уу", 400);
  }
  const user = await req.db.clients.findOne({
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
exports.signup = asyncHandler(async (req, res, next) => {
  const password = generateLengthPass(6);
  if (req.role != "superman") {
    console.log(req.id);
    const user = await req.db.users.findByPk(req.id);
    if (!user.is_active) {
      throw new MyError("Таны эрх хаагдсан байна");
    }
  }
  const user = await req.db.clients.create({
    ...req.body,
    password,
  });
  if (!user) {
    throw new MyError("Бүртгэж чадсангүй");
  }

  const message = `<b>Сайн байна уу?</b><br>
  Та “Хэвлэмэл хуудасны захиалга, хяналтын систем”-д дараах эрхээр нэвтрэн орж хэвлэмэл хуудасны захиалгаа өгнө үү.<br>
  Холбоос: <a href="www.eblank.mn">www.eblank.mn</a><br>
  Нэвтрэх нэр: <b>${req.body.phone_number}</b><br>
  Нууц үг: <b>${password}</b><br>
  Өдрийг сайхан өнгөрүүлээрэй!<br>
  <a href="www.eblank.mn">www.eblank.mn</a>`;
  await sendEmail({
    subject: "Шинэ бүртгэл үүслээ",
    email: req.body.email,
    message,
  });
  res.status(200).json({
    message: "",
    body: { token: user.getJsonWebToken(), user: user },
    // password,
  });
});
exports.getClients = asyncHandler(async (req, res, next) => {
  const sort = req.query.sort;
  let select = req.query.select;

  if (select) {
    select = select.split(" ");
  }

  ["select", "sort"].forEach((el) => delete req.query[el]);

  let query = {};

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

  const users = await req.db.clients.findAll(query);
  res.status(200).json({
    body: { items: users, total: users.length },
  });
});
exports.uploadClientsPhoto = asyncHandler(async (req, res, next) => {
  const file = req.files.file;
  //file type check
  if (!file.mimetype.startsWith("image")) {
    throw new MyError(`Та зураг оруулна уу ..`, 400);
  }
  if (file.size > process.env.IMAGE_SIZE) {
    throw new MyError(`Таны зурагны хэмжээ 20mb хэтэрч болохгүй ..`, 400);
  }
  file.name = "client_" + cuid() + path.parse(file.name).ext;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (err) => {
    if (err) {
      throw new MyError(`оруулах явцад алдаа гарлаа ..`, 400);
    }
  });
  return res.status(200).json({
    message: "",
    body: {
      photo: file.name,
    },
  });
});
exports.forgot_password = asyncHandler(async (req, res, next) => {
  const email = req.body.email;
  if (!email) {
    throw new MyError("хэрэглэгч олдсонгүй!", 400);
  }
  const client = await req.db.clients.findOne({
    where: {
      email,
    },
  });
  if (!client) {
    throw new MyError("хэрэглэгч олдсонгүй!", 400);
  }
  const salt = await bcrypt.genSalt(10);
  const new_password = generateLengthPass(6);
  const password = await bcrypt.hash(new_password, salt);
  await req.db.clients.update(
    { password },
    {
      where: {
        email,
      },
    }
  );

  const find_users = await req.db.clients.findByPk(client.id);
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
exports.getInfo = asyncHandler(async (req, res, next) => {
  const info = await req.db.clients.findByPk(req.id);
  if (!req.id || !info) {
    throw new MyError("Мэдээлэл олдсонгүй", 404);
  }

  res.status(200).json({
    message: "",
    body: info,
  });
});

exports.getManageInfo = asyncHandler(async (req, res, next) => {
  const clientId = req.id;
  const client = await req.db.clients.findByPk(clientId);
  const human = await req.db.users.findByPk(client.userId);
  const god = await req.db.users.findOne({
    where: {
      checker_id: human.id,
    },
  });
  res.status(200).json({
    message: "",
    body: {
      items: [god, human],
    },
  });
});
