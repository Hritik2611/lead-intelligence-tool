const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const leadRoutes = require("./routes/leadRoutes");
const aiRoutes = require("./routes/aiRoutes");
const gleifRoutes = require("./routes/gleifRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Lead Intelligence API is running",
  });
});

// Routes
app.use("/api/leads", leadRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/gleif", gleifRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});