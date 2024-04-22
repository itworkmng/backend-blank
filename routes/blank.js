const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/protect");

const {
  create,
  getAllBlanks,
  removeBlank,
  updateBlanks,
} = require("../controller/blank");

//"/api/v1/blank"
router.route("/:id").put(protect, updateBlanks).delete(protect, removeBlank);
router.route("/").post(protect, create).get(getAllBlanks);

module.exports = router;
