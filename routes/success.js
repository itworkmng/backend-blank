const express = require("express");
const router = express.Router();
router.route("/").get((req, res) => {
  res.status(200).json({
    message: "Finally Update 166: 2024/11/13",
    success: true,
  });
});
module.exports = router;
