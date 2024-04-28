const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  signin,
  signup,
  getClients,
  getInfo,
  getManageInfo,
  forgot_password,
  uploadClientsPhoto,
} = require("../controller/clients");
const { getClientBlanks } = require("../controller/blank");

//"/api/v1/client"
router.route("/").get(getClients);
router.route("/forgot-password").post(forgot_password);
router
  .route("/upload")
  .post(protect, authorize("superman", "god", "human"), uploadClientsPhoto);
router.route("/blank").get(protect, getClientBlanks);
router.route("/signin").post(signin);
router
  .route("/signup")
  .post(protect, authorize("superman", "god", "human"), signup);
router.route("/manage").get(protect, getManageInfo);
router.route("/info").get(protect, getInfo);

module.exports = router;
