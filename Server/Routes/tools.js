const express = require("express");
const router = express.Router();
const pool = require("../Config/db");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Saves to the uploads folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// GET all tools (with optional project filter)
router.get("/", async (req, res) => {
    try {
        const { project_id } = req.query;
        
        let query = "SELECT * FROM tools ORDER BY id ASC";
        let values = [];

        if (project_id) {
            query = "SELECT * FROM tools WHERE project_id = $1 ORDER BY id ASC";
            values = [project_id];
        }

        const result = await pool.query(query, values);
        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving tools" });
    }
});

// GET a single tool by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM tools WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Tool not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving tool" });
    }
});

// POST - Create a new tool
router.post("/", async (req, res) => {
    try {
        const { project_id, name, description } = req.body;

        if (!name || !name.trim() || !project_id) {
            return res.status(400).json({ message: "Name and project_id are required" });
        }

        const result = await pool.query(
            `INSERT INTO tools (project_id, name, description)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [project_id, name.trim(), description ? description.trim() : null]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating tool" });
    }
});

// PUT - Update a tool
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { project_id, name, description } = req.body;

        const result = await pool.query(
            `UPDATE tools 
             SET project_id = $1, name = $2, description = $3 
             WHERE id = $4 
             RETURNING *`,
            [project_id, name ? name.trim() : null, description ? description.trim() : null, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Tool not found" });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating tool" });
    }
});

// DELETE - Remove a tool
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM tools WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Tool not found" });
        }

        res.json({ message: "Tool deleted successfully", tool: result.rows[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting tool" });
    }
});

// PATCH - Update tool image (NEW)
router.patch("/:id/image", upload.single("image"), async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        
        const result = await pool.query(
            "UPDATE tools SET image_url = $1 WHERE id = $2 RETURNING *",
            [imageUrl, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating tool image" });
    }
});

module.exports = router;