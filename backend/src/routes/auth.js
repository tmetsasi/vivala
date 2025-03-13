const express = require('express');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const pool = require('../models/userModel');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const bcrypt = require('bcrypt');

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

router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Täytä kaikki kentät." });
    }

    try {
        // Tarkistetaan, onko käyttäjä jo olemassa
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ success: false, message: "Sähköposti on jo käytössä." });
        }

        // 🔹 Generoidaan käyttäjänimi (esim. emailin alkuosa tai satunnainen arvo)
        const username = email.split("@")[0] + Math.floor(Math.random() * 10000);

        // 🔹 Salataan salasana bcryptillä
        const hashedPassword = await bcrypt.hash(password, 10);

        // 🔹 Lisätään käyttäjä tietokantaan
        const newUser = await pool.query(
            "INSERT INTO users (username, email, password_hash, is_guest) VALUES ($1, $2, $3, FALSE) RETURNING id, username, email, created_at",
            [username, email, hashedPassword]
        );

        return res.status(201).json({ success: true, user: newUser.rows[0] });

    } catch (error) {
        console.error("❌ Rekisteröintivirhe:", error);
        return res.status(500).json({ success: false, message: "Palvelinvirhe.", error: error.toString() });
    }
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Täytä kaikki kentät." });
    }

    try {
        // 🔍 Etsitään käyttäjä tietokannasta
        const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (userQuery.rows.length === 0) {
            return res.status(401).json({ success: false, message: "Virheelliset kirjautumistiedot" });
        }

        const user = userQuery.rows[0];

        // 🔑 Tarkistetaan salasana bcryptillä
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Virheelliset kirjautumistiedot" });
        }

        // 🔥 Luodaan JWT-token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "30d" });

        res.json({ success: true, token, userId: user.id });

    } catch (error) {
        console.error("❌ Kirjautumisvirhe:", error);
        res.status(500).json({ success: false, message: "Palvelinvirhe." });
    }
});


module.exports = router;
