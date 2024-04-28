const express = require("express");
const router = express.Router();
router.route("/").get((req, res) => {
  res.status(200).json({
    message: "Амжилттай 2024/04/28 - 1",
    success: true,
  });
});
module.exports = router;
