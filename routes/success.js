const express = require("express");
const router = express.Router();
router.route("/").get((req, res) => {
  res.status(200).json({
    message: "Амжилттай 2024/04/26",
    success: true,
  });
});
module.exports = router;
