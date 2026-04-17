const limitTaskLength = (req, res, next) => {
  const { task } = req.body;

  if (!task) {
    return res.status(400).json({
      message: "Task is required"
    });
  }

  if (task.length > 140) {
    return res.status(400).json({
      message: "Task exceeds 140 characters"
    });
  }

  next();
};

module.exports = limitTaskLength;