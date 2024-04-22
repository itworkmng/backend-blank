const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  getUsers,
  signin,
  signup,
  getUserClients,
  getInfo,
  updateClient,
  removeClient,
  change_password_client,
  change_password,
  adminsignin,
  getControlUsers,
  getPrintUsers,
  updateUser,
  removeUser,
  getUser,
  forgot_password,
} = require("../controller/users");

//"/api/v1/user"
router.route("/").get(protect, authorize("superman"), getUsers);
router
  .route("/control-user")
  .get(protect, authorize("superman"), getControlUsers);
router.route("/print-user").get(protect, authorize("superman"), getPrintUsers);
router
  .route("/info")
  .get(protect, authorize("human", "superman", "god"), getInfo);

router.route("/forgot-password").post(forgot_password);
router
  .route("/client/:id")
  .get(getUserClients)
  .put(protect, authorize("human", "god", "superman"), updateClient)
  .delete(protect, authorize("human", "god", "superman"), removeClient);
router
  .route("/password/:id")
  .post(protect, authorize("superman", "human", "god"), change_password);
router
  .route("/password/client/:id")
  .post(protect, authorize("human", "god", "superman"), change_password_client);
router.route("/signin").post(signin);
router.route("/admin/signin").post(adminsignin);
router.route("/signup").post(protect, authorize("superman"), signup);

router
  .route("/:id")
  .get(protect, authorize("superman"), getUser)
  .put(protect, authorize("superman"), updateUser)
  .delete(protect, authorize("superman"), removeUser);
module.exports = router;
