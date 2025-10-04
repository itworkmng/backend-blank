const express = require("express");
const router = express.Router();
router.route("/").get((req, res) => {
  res.status(200).json({
    message: {
      message: "EBlank",
      version: "1.0.0",
      description: "Checker & Email Security",
    },
    success: true,
  });
});
module.exports = router;
