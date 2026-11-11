const express = require("express");
const router = express.Router();
const pool = require("../Config/db");

// GET all projects (with optional category filter)
router.get("/", async (req, res) => {
    try {
        const { category_id } = req.query;
        
        let query = "SELECT * FROM projects ORDER BY created_at DESC";
        let values = [];

        if (category_id) {
            query = "SELECT * FROM projects WHERE category_id = $1 ORDER BY created_at DESC";
            values = [category_id];
        }

        const result = await pool.query(query, values);
        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving projects" });
    }
});

// GET a single project by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM projects WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving project" });
    }
});

// POST - Create a new project
router.post("/", async (req, res) => {
    try {
        const { category_id, title, description, instructions, difficulty, estimated_time } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ message: "Title is required" });
        }

        const result = await pool.query(
            `INSERT INTO projects (category_id, title, description, instructions, difficulty, estimated_time)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [
                category_id || null, 
                title.trim(), 
                description ? description.trim() : null, 
                instructions ? instructions.trim() : null, 
                difficulty ? difficulty.trim() : null,
                estimated_time ? estimated_time.trim() : null
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating project" });
    }
});

// PUT - Update a project
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { category_id, title, description, instructions, difficulty, estimated_time } = req.body;

        const result = await pool.query(
            `UPDATE projects 
             SET category_id = $1, 
                 title = $2, 
                 description = $3, 
                 instructions = $4, 
                 difficulty = $5,
                 estimated_time = $6
             WHERE id = $7 
             RETURNING *`,
            [
                category_id || null, 
                title ? title.trim() : null, 
                description ? description.trim() : null, 
                instructions ? instructions.trim() : null, 
                difficulty ? difficulty.trim() : null,
                estimated_time ? estimated_time.trim() : null,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating project" });
    }
});

// DELETE - Remove a project
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM projects WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.json({ message: "Project deleted successfully", project: result.rows[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting project" });
    }
});

module.exports = router;