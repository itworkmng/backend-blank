const express = require("express");
const dotenv = require("dotenv");
var path = require("path");
var rfs = require("rotating-file-stream");
const colors = require("colors");
const errorHandler = require("./middleware/error");
var morgan = require("morgan");
const logger = require("./middleware/logger");
const fileupload = require("express-fileupload");

const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

// Router оруулж ирэх
const usersRoutes = require("./routes/users");
const clientsRoutes = require("./routes/clients");
const blankRoutes = require("./routes/blank");
const mailRoutes = require("./routes/mail");
const orderRoutes = require("./routes/order");
const payRoutes = require("./routes/payment");
const adminRoutes = require("./routes/admin");
const successRoutes = require("./routes/success");
const injectDb = require("./middleware/injectDb");

// Аппын тохиргоог process.env рүү ачаалах
dotenv.config({ path: "./config/config.env" });

const db = require("./config/db-mysql");

const app = express();

// Express rate limit : Дуудалтын тоог хязгаарлана
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 500, // limit each IP to 100 requests per windowMs
  message: "5 минутанд 3 удаа л хандаж болно! ",
});

app.use(limiter);
// http parameter pollution халдлагын эсрэг books?name=aaa&name=bbb  ---> name="bbb"
app.use(hpp());
// Cookie байвал req.cookie рүү оруулж өгнө0
app.use(cookieParser());
// Бидний бичсэн логгер

app.use(logger);
// Body дахь өгөгдлийг Json болгож өгнө
app.use(express.json());
// Өөр өөр домэйнтэй вэб аппуудад хандах боломж өгнө
app.use(cors());
// Клиент вэб аппуудыг мөрдөх ёстой нууцлал хамгаалалтыг http header ашиглан зааж өгнө
app.use(helmet());
// клиент сайтаас ирэх Cross site scripting халдлагаас хамгаална
app.use(xss());
// Сэрвэр рүү upload хийсэн файлтай ажиллана
app.use(fileupload());
// req.db рүү mysql db болон sequelize моделиудыг оруулна
app.use(injectDb(db));

// create a write stream (in append mode)
var accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "log"),
});

app.use(morgan("combined", { stream: accessLogStream }));
app.use("/api/v1/user", usersRoutes);
app.use("/api/v1/client", clientsRoutes);
app.use("/api/v1/blank", blankRoutes);
app.use("/api/v1/mail", mailRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/payment", payRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1", successRoutes);
app.use(errorHandler);

db.users.hasMany(db.clients, { onDelete: "CASCADE", hooks: true });
db.clients.belongsTo(db.users);

db.clients.hasMany(db.payment, { onDelete: "CASCADE", hooks: true });
db.clients.hasMany(db.order, { onDelete: "CASCADE", hooks: true });
db.clients.hasMany(db.blank, { onDelete: "CASCADE", hooks: true });

db.users.hasMany(db.blank, { onDelete: "CASCADE", hooks: true });
db.blank.belongsTo(db.users);

db.users.hasMany(db.order, { onDelete: "CASCADE", hooks: true });
db.order.belongsTo(db.users);

db.order.hasMany(db.order_item, { onDelete: "CASCADE", hooks: true });
db.order_item.belongsTo(db.order);
db.order.hasMany(db.payment, { onDelete: "CASCADE", hooks: true });
db.payment.belongsTo(db.order);

db.blank.hasMany(db.order_item, { onDelete: "CASCADE", hooks: true });
db.order_item.belongsTo(db.blank);

db.sequelize
  .sync()
  .then((result) => {
    console.log("sync hiigdlee...");
  })
  .catch((err) => console.log(err));

const server = app.listen(
  process.env.PORT,
  console.log(`Express сэрвэр ${process.env.PORT} порт дээр аслаа... `.rainbow)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Алдаа гарлаа : ${err.message}`.underline.red.bold);
  server.close(() => {
    process.exit(1);
  });
});
