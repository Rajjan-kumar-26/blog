require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const mysql = require("mysql2");

const postsRouter = require("./routes/posts");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MySQL RDS connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error("MySQL/RDS connection error:", err.message);
    } else {
        console.log("RDS MySQL connected successfully");
    }
});

// Make DB available to routes
app.locals.db = db;

// API routes
app.use("/api/posts", postsRouter);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

// React production build
if (process.env.NODE_ENV === "production") {
    const buildPath = path.join(__dirname, "../frontend/dist");

    app.use(express.static(buildPath));

    app.get("*", (req, res) => {
        res.sendFile(path.join(buildPath, "index.html"));
    });
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
