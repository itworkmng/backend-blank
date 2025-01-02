const express = require("express");
const router = express.Router();
router.route("/").get((req, res) => {
  res.status(200).json({
    message: {
      counter:170,
      message:"Fix related hynalt"
    },
    success: true,
  });
});
module.exports = router;
