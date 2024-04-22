const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");
const zlib = require("zlib");

const { change_password_email } = require("../controller/mail");

//"/api/v1/client"
router.route("/").post(protect, change_password_email);
module.exports = router;
