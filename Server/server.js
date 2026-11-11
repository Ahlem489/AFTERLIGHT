const express = require("express");
const cors = require("cors");
const pool = require("./Config/db");

const app = express();

// 1. Middleware FIRST
app.use(cors());
app.use(express.json()); // Crucial: must be before routes to parse JSON bodies

// 2. Routes SECOND
app.use("/api/categories", require("./Routes/categories"));
app.use("/api/articles", require("./Routes/articles"));
app.use("/api/projects", require("./Routes/projects"));
app.use("/api/materials", require("./Routes/materials"));
app.use("/api/tools", require("./Routes/tools"));
app.use("/uploads", express.static("uploads")); // Add this line

// 3. Health Check Routes
app.get("/", (req, res) => {
    res.send("AFTERLIGHT API is running!");
});

app.get("/api/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT current_database()");
        res.json({
            message: "Database connected successfully!",
            database: result.rows[0].current_database
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database connection failed" });
    }
});

// 4. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`AFTERLIGHT API running on port ${PORT}`);
});