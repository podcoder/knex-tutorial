const express = require('express');
const router = express.Router();

// Get environment variable, defaulting to "development"
const env = process.env.NODE_ENV || "development";

// Knex.js configuration file for database connection
const knexConfig = require('../knexfile');
const db = require("knex")(knexConfig[env]);

/**
 * GET /posts
 * 
 * Endpoint to fetch all posts from the database.
 * 
 * @returns {Array} An array of post objects.
 */
router.get("/", (req, res) => {
    db("posts")
        .then(posts => {
            res.json(posts);
        })
        .catch(err => {
            res.status(500).json({ error: "Failed to fetch posts" });
        });
});

/**
 * GET /posts/:id
 * 
 * Endpoint to fetch a single post by ID from the database.
 * 
 * @param {number} id - The ID of the post to fetch.
 * @returns {Object} The post object corresponding to the provided ID.
 * @throws 404 - If no post with the provided ID is found.
 */
router.get("/:id", (req, res) => {
    const { id } = req.params;

    db("posts")
        .where({ id })
        .first()
        .then(post => {
            if (!post) {
                return res.status(404).json({ error: "Post not found" });
            }
            res.json(post);
        })
        .catch(err => {
            res.status(500).json({ error: "Failed to fetch post" });
        });
});

/**
 * POST /posts
 * 
 * Endpoint to create a new post in the database.
 * 
 * @body {Object} post - The post data to be created. Must contain:
 * - `title`: The title of the post.
 * - `content`: The content of the post.
 * - `created_by`: The ID of the user who created the post.
 * 
 * @returns {Object} The created post object with the assigned ID.
 * @throws 400 - If required fields are missing or invalid.
 */
router.post("/", (req, res) => {
    const { title, content, created_by } = req.body;
    const created_at = new Date().toISOString();

    // Basic validation of required fields
    if (!title || !content || !created_by) {
        return res.status(400).json({ error: "Title, content, and created_by are required" });
    }

    db("posts")
        .insert({ title, content, created_by, created_at })
        .returning("*")
        .then(post => {
            res.status(201).json(post[0]);
        })
        .catch(err => {
            res.status(500).json({ error: "Failed to create post" });
        });
});

/**
 * PUT /posts/:id
 * 
 * Endpoint to update an existing post by ID.
 * 
 * @param {number} id - The ID of the post to update.
 * @body {Object} post - The post data to be updated. Optional fields:
 * - `title`: The title of the post.
 * - `content`: The content of the post.
 * - `updated_at`: The timestamp when the post was last updated.
 * 
 * @returns {Object} The updated post object.
 * @throws 400 - If no data is provided for updating.
 * @throws 404 - If the post with the provided ID is not found.
 */
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const updated_at = new Date().toISOString();

    if (!title && !content) {
        return res.status(400).json({ error: "No data provided to update" });
    }

    db("posts")
        .where({ id })
        .update({ title, content, updated_at })
        .returning("*")
        .then(post => {
            if (!post.length) {
                return res.status(404).json({ error: "Post not found" });
            }
            res.json(post[0]);
        })
        .catch(err => {
            res.status(500).json({ error: "Failed to update post" });
        });
});

/**
 * DELETE /posts/:id
 * 
 * Endpoint to delete a post by ID.
 * 
 * @param {number} id - The ID of the post to delete.
 * 
 * @returns {Object} Confirmation of the deletion.
 * @throws 404 - If no post with the provided ID is found.
 */
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    db("posts")
        .where({ id })
        .del()
        .then(count => {
            if (!count) {
                return res.status(404).json({ error: "Post not found" });
            }
            res.json({ message: "Post deleted successfully" });
        })
        .catch(err => {
            res.status(500).json({ error: "Failed to delete post" });
        });
});

module.exports = router;