const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");
const gmailOnly = require("../middleware/gmailMiddleware");
const onlyJSON = require("../middleware/jsonMiddleware");
const limitTaskLength = require("../middleware/taskLengthMiddleware");

// CREATE + GET
router.route("/")
  .post(protect, gmailOnly, onlyJSON, limitTaskLength, createTask)
  .get(protect, gmailOnly, getTasks);

// UPDATE + DELETE
router.route("/:id")
  .put(protect, gmailOnly, onlyJSON, limitTaskLength, updateTask)
  .delete(protect, gmailOnly, deleteTask);

module.exports = router;