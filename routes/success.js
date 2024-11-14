const express = require("express");
const router = express.Router();
router.route("/").get((req, res) => {
  res.status(200).json({
    message: {
      counter:167,
      message:"Error 505 fixed"
    },
    success: true,
  });
});
module.exports = router;
