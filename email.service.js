const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true, // Important: true pour le port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendShareInvitation(modelId, senderEmail, recipientEmail, role) {
    try {
      // Vérifier la connexion SMTP
    await this.transporter.verify();
      
      const mailOptions = {
        from: process.env.SMTP_FROM,
        to: recipientEmail,
        subject: 'Invitation à collaborer sur un modèle 3D',
        html: `
            <h2>Invitation à collaborer</h2>
            <p>${senderEmail} vous invite à collaborer sur un modèle 3D.</p>
            <p>Votre rôle : ${role}</p>
            <p>Pour accéder au modèle, cliquez sur le lien suivant :</p>
            <a href="${process.env.FRONTEND_URL}/viewer/${modelId}">Voir le modèle</a>
        `
    };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email envoyé:', result);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();