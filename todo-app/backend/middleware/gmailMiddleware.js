const User = require("../models/User");

const gmailOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.username.endsWith("@gmail.com")) {
      return res.status(403).json({
        message: "Access denied: Gmail accounts only"
      });
    }

    next();

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = gmailOnly;