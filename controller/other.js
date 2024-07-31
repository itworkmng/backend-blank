const axios = require("axios");
const asyncHandler = require("../middleware/asyncHandle");
const MyError = require("../utils/myError");

exports.findRgstr = asyncHandler(async (req, res, next) => {
  const { register } = req.body;
  if (!register) {
    throw new MyError("Регистр байхгүй байна", 404);
  }
  const url = `https://info.ebarimt.mn/rest/merchant/info?regno=${register}`;
  try {
    const response = await axios.get(url);
    res.status(200).json({
      message: "",
      body: response.data, // Extracting the data property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
      },
    });
  }
});
