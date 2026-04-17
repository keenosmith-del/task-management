const onlyJSON = (req, res, next) => {
  if (!req.is("application/json") && !req.is("application/json; charset=utf-8")) {
    return res.status(400).json({
      message: "Only JSON requests are allowed"
    });
  }

  next();
};

module.exports = onlyJSON;