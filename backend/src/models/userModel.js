const { Pool } = require('pg');

const isLocal = process.env.DATABASE_URL.includes('localhost'); // Tarkistetaan, onko käytössä paikallinen PostgreSQL

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isLocal ? false : { rejectUnauthorized: false }
});

// ✅ Luo käyttäjätaulu, jos sitä ei ole vielä olemassa
const createUserTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE,
            password_hash TEXT,
            google_id TEXT UNIQUE,
            apple_id TEXT UNIQUE,
            is_guest BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT NOW()
        );
    `;
    await pool.query(query);
    console.log('✅ User table checked/created');
};

// ✅ Suorita taulun luonti heti, kun palvelin käynnistyy
createUserTable();

module.exports = pool;
