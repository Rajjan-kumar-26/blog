require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const postsRouter = require("./routes/posts");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mernblog";

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/posts", postsRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Serve React build in production (single EC2 instance setup)
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(buildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
