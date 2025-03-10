const express = require('express');
const pool = require('../models/userModel');
const jwt = require('jsonwebtoken');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

router.get('/profile', async (req, res) => {
    try {
        console.log("➡️ GET /api/user/profile kutsuttu");

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ success: false, message: "Token puuttuu" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        const userQuery = await pool.query(
            'SELECT id, username, email, google_id, apple_id, is_guest, created_at FROM users WHERE id = $1',
            [decoded.userId]
        );

        if (userQuery.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Käyttäjää ei löydy" });
        }

        res.json({ success: true, user: userQuery.rows[0] });
    } catch (error) {
        console.error("❌ Profiilitietojen haku epäonnistui:", error);
        res.status(500).json({ success: false, message: "Profiilitietojen haku epäonnistui." });
    }
});

module.exports = router;
