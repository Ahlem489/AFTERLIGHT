const express = require("express");
const router = express.Router();
const pool = require("../Config/db");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });
// GET all articles (with optional category filter)
router.get("/", async (req, res) => {
    try {
        const { category_id } = req.query;
        
        let query = "SELECT * FROM articles ORDER BY created_at DESC";
        let values = [];

        if (category_id) {
            query = "SELECT * FROM articles WHERE category_id = $1 ORDER BY created_at DESC";
            values = [category_id];
        }

        const result = await pool.query(query, values);
        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving articles" });
    }
});

// GET a single article by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM articles WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Article not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving article" });
    }
});
// GET a single article by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM articles WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Article not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving article" });
    }
});

// POST - Create a new article
router.post("/", async (req, res) => {
    try {
        const { category_id, title, content, summary, difficulty } = req.body;

        if (!title || !title.trim() || !content || !content.trim()) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        const result = await pool.query(
            `INSERT INTO articles (category_id, title, content, summary, difficulty)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [
                category_id || null, 
                title.trim(), 
                content.trim(), 
                summary ? summary.trim() : null, 
                difficulty ? difficulty.trim() : null
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating article" });
    }
});

// PUT - Update an article
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { category_id, title, content, summary, difficulty } = req.body;

        const result = await pool.query(
            `UPDATE articles 
             SET category_id = $1, 
                 title = $2, 
                 content = $3, 
                 summary = $4, 
                 difficulty = $5,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $6 
             RETURNING *`,
            [
                category_id || null, 
                title ? title.trim() : null, 
                content ? content.trim() : null, 
                summary ? summary.trim() : null, 
                difficulty ? difficulty.trim() : null, 
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Article not found" });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating article" });
    }
});

// DELETE - Remove an article
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM articles WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Article not found" });
        }

        res.json({ message: "Article deleted successfully", article: result.rows[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting article" });
    }
});
// PATCH - Update article image
router.patch("/:id/image", upload.single("image"), async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        
        const result = await pool.query(
            "UPDATE articles SET image_url = $1 WHERE id = $2 RETURNING *",
            [imageUrl, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating article image" });
    }
});
module.exports = router;