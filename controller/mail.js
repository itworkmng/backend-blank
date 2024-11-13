const asyncHandler = require("../middleware/asyncHandle");
const sendEmail = require("../utils/email");

exports.change_password_email = asyncHandler(async (req, res, next) => {
  const message = `<b>Сайн байна уу?</b><br>
  Та “Хэвлэмэл хуудасны захиалга, хяналтын систем”-д дараах эрхээр нэвтрэн орж хэвлэмэл хуудасны захиалгаа өгнө үү.<br>
  Холбоос: <a href="www.eblank.mn">www.eblank.mn</a><br>
  Нэвтрэх нэр: <b>${req.body.phone_number}</b><br>
  Нууц үг: <b>${req.body.passwordr}</b><br>
  Өдрийг сайхан өнгөрүүлээрэй!<br>
  <a href="www.eblank.mn">www.eblank.mn</a>`;
  await sendEmail({
    subject: "Нууц үг солигдлоо",
    email: req.body.email,
    message,
  });
  res.status(200).json({
    message: "",
    body: { success: true },
  });
});
