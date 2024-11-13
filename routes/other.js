const express = require("express");
const router = express.Router();
const { findRgstr } = require("../controller/other");

//"/api/v1/other"
router.route("/company/:id").get(findRgstr);
module.exports = router;
