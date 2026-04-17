require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const protect = require("./middleware/authMiddleware");
const gmailOnly = require("./middleware/gmailMiddleware");

const limitTaskLength = require("./middleware/taskLengthMiddleware");

const onlyJSON = require("./middleware/jsonMiddleware");

const taskRoutes = require("./routes/taskRoutes");

// Initialize app FIRST
const app = express();

// Connect DB
connectDB();

// error handle
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("Missing environment variables");
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Protected route
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user
  });
});

// Gmail middleware route
app.get("/api/gmail-test", protect, gmailOnly, (req, res) => {
  res.json({ message: "Gmail access granted" });
});

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.post(
  "/api/task-test",
  protect,
  gmailOnly,
  onlyJSON,
  limitTaskLength,
  (req, res) => {
    res.json({ message: "Task accepted" });
  }
);

// Port
const PORT = process.env.PORT || 5050;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});