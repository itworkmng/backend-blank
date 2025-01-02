const express = require("express");
const router = express.Router();
router.route("/").get((req, res) => {
  res.status(200).json({
    message: {
      counter:168,
      message:"update order lits fix"
    },
    success: true,
  });
});
module.exports = router;
