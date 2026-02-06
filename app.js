const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const shareRoutes = require('./routes/shareRoutes');
const modelRoutes = require('./routes/modelRoutes');
const triposrRouter = require('./routes/triposrRoutes');
const path = require('path');
const pool = require('./config/db');
dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
}));
// Utilisation du routeur
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/models', modelRoutes);
app.use('/triposr', triposrRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Something went wrong!' 
  });
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

(async () => {
  try {
//bch naamel test b requete heki 
    await pool.query('SELECT 1'); 
    console.log('Backend est correctement connecté à MySQL. !');
  } catch (error) {
    console.error('Erreur de connexion à MySQL dans le :', error.message);
  }
})();
module.exports = app;
