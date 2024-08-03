const axios = require("axios");
const asyncHandler = require("../middleware/asyncHandle");
const MyError = require("../utils/myError");

exports.findRgstr = asyncHandler(async (req, res, next) => {
  const register = req.params.id;
  if (!register) {
    throw new MyError("Регистр байхгүй байна", 404);
  }

  const tinUrl = `https://api.ebarimt.mn/api/info/check/getTinInfo?regNo=${register}`;
  const regUrl = `https://api.ebarimt.mn/api/info/check/getInfo?tin=`;
  try {
    await axios.get(tinUrl).then(async (res1) => {
      const tinObj = res1.data;
      await axios.get(`${regUrl}${tinObj.data}`).then((res2) => {
        res.status(200).json({
          message: "",
          body: res2.data,
        });
      });
    }); // 10 seconds timeout
  } catch (error) {
    let errorMessage = error.message;
    if (error.code === "ECONNABORTED") {
      errorMessage = "Request timed out";
    }
    console.error(`Error fetching data from ${tinUrl}:`, error);
    res.status(500).json({
      success: false,
      error: {
        message: errorMessage,
      },
    });
  }
});
