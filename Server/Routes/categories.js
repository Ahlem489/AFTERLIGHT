
const express = require("express");
const router = express.Router();
const pool = require("../Config/db");

// GET all categories (with optional search)
router.get("/", async (req, res) => {
    try {
        const { search } = req.query;
        
        let query = "SELECT * FROM categories";
        let values = [];

        // If there is a search term, filter by name OR description
        if (search) {
            query += " WHERE name ILIKE $1 OR description ILIKE $1";
            values = [`%${search}%`];
        }

        query += " ORDER BY id ASC";

        const result = await pool.query(query, values);
        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving categories" });
    }
});
// GET a single category by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM categories WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving category" });
    }
});
// POST - Create a category
router.post("/", async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Category name is required"
            });
        }

        const result = await pool.query(
            `INSERT INTO categories (name, description)
             VALUES ($1, $2)
             RETURNING *`,
            [name.trim(), description || null]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);

        if (error.code === "23505") {
            return res.status(409).json({
                message: "Category already exists"
            });
        }

        res.status(500).json({
            message: "Error creating category"
        });
    }
});
// PUT - Update a category
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const result = await pool.query(
            `UPDATE categories
             SET name = $1, description = $2
             WHERE id = $3
             RETURNING *`,
            [name, description || null, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error updating category"
        });
    }
});
// DELETE - Remove a category
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM categories WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.json({
            message: "Category deleted successfully",
            category: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        
        // 23503 is the PostgreSQL code for a foreign key constraint violation
        // This protects you from deleting a category that still has articles/projects attached to it
        if (error.code === "23503") {
            return res.status(400).json({
                message: "Cannot delete category: it is currently linked to other records."
            });
        }

        res.status(500).json({
            message: "Error deleting category"
        });
    }
});

module.exports = router;
