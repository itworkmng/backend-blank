const express = require("express");
const {
  createOrder,
  getClientOrder,
  getOrder,
  getClientUnPaidOrder,
  removerOrder,
  getOrders,
  getOrdersUnPaid,
  updateOrder,
} = require("../controller/order");
const { protect, authorize } = require("../middleware/protect");
const router = express.Router();
router
  .route("/")
  .get(protect, authorize("god", "human", "superman"), getOrders);
router
  .route("/unpaid")
  .get(protect, authorize("god", "human", "superman"), getOrdersUnPaid);
router.route("/create").post(protect, createOrder);
router.route("/client").get(protect, getClientOrder);
router.route("/client/unpaid").get(protect, getClientUnPaidOrder);
router.route("/:id").get(protect, getOrder).delete(protect, removerOrder);
router
  .route("/user/:id")
  .post(protect, authorize("god", "human", "superman"), updateOrder);

module.exports = router;
