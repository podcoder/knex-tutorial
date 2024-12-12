const express = require('express');
const router = express.Router();

// Get environment variable, defaulting to "development"
const env = process.env.NODE_ENV || "development";

// Knex.js configuration file for database connection
const knexConfig = require('../knexfile');
const db = require("knex")(knexConfig[env]);

/**
 * GET /users
 * 
 * Endpoint to fetch all users from the database.
 * 
 * @returns {Array} An array of user objects.
 */
router.get("/", (req, res) => {
    db("users")
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res.status(500).json({ error: "Failed to fetch users" });
        });
});

/**
 * GET /users/:id
 * 
 * Endpoint to fetch a single user by ID from the database.
 * 
 * @param {number} id - The ID of the user to fetch.
 * @returns {Object} The user object corresponding to the provided ID.
 * @throws 404 - If no user with the provided ID is found.
 */
router.get("/:id", (req, res) => {
    const { id } = req.params;

    db("users")
        .where({ id })
        .first()
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json(user);
        })
        .catch(err => {
            res.status(500).json({ error: "Failed to fetch user" });
        });
});

/**
 * POST /users
 * 
 * Endpoint to create a new user in the database.
 * 
 * @body {Object} user - The user data to be created. Must contain:
 * - `name`: The name of the user.
 * - `email`: The email of the user.
 * 
 * @returns {Object} The created user object with the assigned ID.
 * @throws 400 - If required fields are missing or invalid.
 */
router.post("/", (req, res) => {
    const { name, email } = req.body;

    // Basic validation of required fields
    if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
    }

    db("users")
        .insert({ name, email })
        .returning("*")
        .then(user => {
            res.status(201).json(user[0]);
        })
        .catch(err => {
            res.status(500).json({ error: "Failed to create user" });
        });
});

/**
 * PUT /users/:id
 * 
 * Endpoint to update an existing user by ID.
 * 
 * @param {number} id - The ID of the user to update.
 * @body {Object} user - The user data to be updated. Optional fields:
 * - `name`: The name of the user.
 * - `email`: The email of the user.
 * 
 * @returns {Object} The updated user object.
 * @throws 400 - If no data is provided for updating.
 * @throws 404 - If the user with the provided ID is not found.
 */
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name && !email) {
        return res.status(400).json({ error: "No data provided to update" });
    }

    db("users")
        .where({ id })
        .update({ name, email })
        .returning("*")
        .then(user => {
            if (!user.length) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json(user[0]);
        })
        .catch(err => {
            res.status(500).json({ error: "Failed to update user" });
        });
});

/**
 * DELETE /users/:id
 * 
 * Endpoint to delete a user by ID.
 * 
 * @param {number} id - The ID of the user to delete.
 * 
 * @returns {Object} Confirmation of the deletion.
 * @throws 404 - If no user with the provided ID is found.
 */
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    db("users")
        .where({ id })
        .del()
        .then(count => {
            if (!count) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json({ message: "User deleted successfully" });
        })
        .catch(err => {
            res.status(500).json({ error: "Failed to delete user" });
        });
});

module.exports = router;
