const fs = require('fs');
const path = require('path');
const axios = require('axios');

class TriposrController {
  constructor() {
    this.uploadDir = './uploads3D';
    this.ensureUploadDirectory();
  }

  ensureUploadDirectory() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  // Envoie l'image à TripoSR
  async convertImage(filePath) {
    const formData = new FormData();
    const file = fs.readFileSync(filePath);
    const blob = new Blob([file], { type: 'image/jpeg' });
    const filename = path.basename(filePath);

    // Utilisation de Blob + form-data (simulateur car Node.js n'a pas natif Blob)
    const { createReadStream } = require('fs');
    const form = new FormData();
    form.append('file', createReadStream(filePath));

    try {
      console.log('[TripoSR] Envoi de l’image vers /generate_3d...');
      const response = await axios.post('http://localhost:5000/generate_3d', form, {
        headers: form.getHeaders()
      });

      console.log('[TripoSR] Réponse reçue:', response.data);
      return response.data;
    } catch (error) {
      console.error('[TripoSR] Erreur lors de l’upload :', error.message);
      throw error;
    }
  }

  // Vérifie périodiquement si la conversion est terminée
  async pollStatus(requestId) {
    const statusUrl = `http://localhost:5000/status/${requestId}`;
    console.log(`[Polling] Attente de la fin de conversion...`);

    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const res = await axios.get(statusUrl);
          console.log(`[Statut] ${res.data.status}`);

          if (res.data.status === 'complété') {
            clearInterval(interval);
            resolve();
          }
        } catch (err) {
          clearInterval(interval);
          reject(new Error(`Échec de vérification du statut: ${err.message}`));
        }
      }, 3000); // Vérifie toutes les 3 secondes
    });
  }

  // Télécharge le fichier .obj généré
  async downloadModel(requestId, outputPath) {
    const downloadUrl = `http://localhost:5000/download/${requestId}`;

    try {
      console.log(`[Téléchargement] depuis ${downloadUrl}`);
      const writer = fs.createWriteStream(outputPath);
      const response = await axios.get(downloadUrl, {
        responseType: 'stream'
      });

      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
    } catch (error) {
      throw new Error(`Erreur lors du téléchargement: ${error.message}`);
    }
  }

  // Supprime les fichiers temporaires
  async cleanupFiles(files) {
    const promises = files.map(file =>
      fs.promises.unlink(file).catch(() => {})
    );
    await Promise.all(promises);
    console.log('[Nettoyage] Fichiers temporaires supprimés.');
  }
}

module.exports = new TriposrController();