const express = require("express");
const router = express.Router();
router.route("/").get((req, res) => {
  res.status(200).json({
    message: "Finally Update 164: 2024/08/03",
    success: true,
  });
});
module.exports = router;
