const express = require("express");
const router = express.Router();
router.route("/").get((req, res) => {
  res.status(200).json({
    message: "Finally Update 151: 2024/06/15",
    success: true,
  });
});
module.exports = router;
