const express = require("express");
const router = express.Router();
router.route("/").get((req, res) => {
  res.status(200).json({
    message: {
      counter:171,
      message:"Admin Counter Fix related hynalt"
    },
    success: true,
  });
});
module.exports = router;
