const express = require("express");
const { protect, authorize } = require("../middleware/protect");
const { create } = require("../controller/payment");
const router = express.Router();
router.route("/").post(protect, authorize("human", "superman"), create);
module.exports = router;
