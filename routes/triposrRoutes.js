const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const triposrController = require('../controllers/triposr.controller');

// Configuration du stockage des fichiers uploadés
const storage = multer.diskStorage({
  destination: './uploads3D/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Type de fichier non supporté'));
      return;
    }
    cb(null, true);
  }
}).single('file');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

// Route pour tester si TripoSR est actif
router.get('/status', (req, res) => {
    res.json({ status: 'ok' });
});

// Route principale de conversion
router.post('/convert', (req, res) => {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier image fourni' });
    }

    try {
      // 1. Envoie l'image au serveur Flask
      const tripData = await triposrController.convertImage(req.file.path);

      // 2. Attends que la conversion soit terminée
      await triposrController.pollStatus(tripData.request_id);

      // 3. Télécharge le modèle généré
      const outputPath = req.file.path.replace(/\.[^/.]+$/, '.obj');
      await triposrController.downloadModel(tripData.request_id, outputPath);

      // 4. Renvoie le fichier .obj
      res.download(outputPath, (downloadErr) => {
        if (downloadErr) {
          console.error('Erreur lors du téléchargement:', downloadErr);
          return res.status(500).json({ error: 'Échec du téléchargement' });
        }
        // 5. Nettoyage des fichiers temporaires
        triposrController.cleanupFiles([req.file.path, outputPath])
          .catch(console.error);
      });

    } catch (error) {
      console.error('Erreur lors de la conversion:', error.message);
      res.status(500).json({ error: 'Erreur interne du serveur' });

      triposrController.cleanupFiles([req.file.path]).catch(console.error);
    }
  });
});

// Gestion des requêtes CORS
router.options('/convert', (req, res) => {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  res.sendStatus(200);
});

module.exports = router;