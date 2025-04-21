const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const pool = require('./config/db');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend bien installer!');
});
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000; // Utiliser un port différent pour Express
app.listen(PORT, () => {
  console.log(`Server express bien configuerer port :${PORT}`);
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