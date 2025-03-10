const express = require('express');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const pool = require('../models/userModel');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// 📌 Vierailijana kirjautuminen (Guest Login)
router.post('/guest', async (req, res) => {
    try {
        const username = `guest${Math.floor(100000 + Math.random() * 900000)}`;

        // 🔍 Tarkista, onko sama käyttäjänimi jo olemassa
        const existingUser = await pool.query('SELECT id FROM users WHERE username = $1', [username]);

        if (existingUser.rows.length > 0) {
            console.log("⚠️ Guest user already exists:", existingUser.rows[0].id);
            return res.json({ success: true, userId: existingUser.rows[0].id });
        }

        const guestId = uuidv4();

        // 📌 Lisää käyttäjä tietokantaan
        await pool.query(
            'INSERT INTO users (id, username, is_guest) VALUES ($1, $2, $3)',
            [guestId, username, true]
        );

        // 🔥 Luo JWT-token
        const token = jwt.sign({ userId: guestId, guest: true }, JWT_SECRET, { expiresIn: '30d' });

        res.json({ success: true, token, userId: guestId });
    } catch (error) {
        console.error("❌ Guest login error:", error);
        res.status(500).json({ success: false, message: 'Guest login failed', error });
    }
});

module.exports = router;
