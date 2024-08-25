const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");
const { getCounts, getUserCounts, signup } = require("../controller/admin");
const { adminsignin } = require("../controller/users");

//"/api/v1/admin"
router.route("/counts").get(protect, authorize("superman"), getCounts);
router
  .route("/counts/:id")
  .get(protect, authorize("superman", "human", "god"), getUserCounts);
router.route("/signin").post(adminsignin);
router.route("/signup").post(signup);
module.exports = router;
