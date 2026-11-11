const express = require("express");
const router = express.Router();
const pool = require("../Config/db");
const multer = require("multer"); // Add this
const path = require("path");     // Add this

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Saves to the uploads folder we created
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// GET all materials (with optional project filter)
router.get("/", async (req, res) => {
    try {
        const { project_id } = req.query;
        
        let query = "SELECT * FROM materials ORDER BY id ASC";
        let values = [];

        if (project_id) {
            query = "SELECT * FROM materials WHERE project_id = $1 ORDER BY id ASC";
            values = [project_id];
        }

        const result = await pool.query(query, values);
        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving materials" });
    }
});

// GET a single material by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM materials WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Material not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving material" });
    }
});

// POST - Create a new material
router.post("/", async (req, res) => {
    try {
        const { project_id, name, quantity, description } = req.body;

        if (!name || !name.trim() || !project_id) {
            return res.status(400).json({ message: "Name and project_id are required" });
        }

        const result = await pool.query(
            `INSERT INTO materials (project_id, name, quantity, description)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [project_id, name.trim(), quantity ? quantity.trim() : null, description ? description.trim() : null]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating material" });
    }
});

// PUT - Update a material
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { project_id, name, quantity, description } = req.body;

        const result = await pool.query(
            `UPDATE materials 
             SET project_id = $1, name = $2, quantity = $3, description = $4 
             WHERE id = $5 
             RETURNING *`,
            [project_id, name ? name.trim() : null, quantity ? quantity.trim() : null, description ? description.trim() : null, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Material not found" });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating material" });
    }
});

// DELETE - Remove a material
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM materials WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Material not found" });
        }

        res.json({ message: "Material deleted successfully", material: result.rows[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting material" });
    }
});
router.patch("/:id/image", upload.single("image"), async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Create the URL that the frontend can use to display the image
        const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

        const result = await pool.query(
            "UPDATE materials SET image_url = $1 WHERE id = $2 RETURNING *",
            [imageUrl, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating material image" });
    }
});


module.exports = router;