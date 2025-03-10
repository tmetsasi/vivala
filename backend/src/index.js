require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/auth');  // ✅ Autentikaatio
const userRoutes = require('./routes/user');  // ✅ Lisää tämä!

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);  // ✅ Lisää tämä!

// Testireitti
app.get('/', (req, res) => {
  res.send('🔥 VivaLa Backend toimii! 🚀');
});

// Käynnistä palvelin
app.listen(PORT, () => {
  console.log(`🚀 Backend pyörii osoitteessa http://localhost:${PORT}`);
});
