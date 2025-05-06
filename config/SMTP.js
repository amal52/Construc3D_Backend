const nodemailer = require('nodemailer');
const logger = {
    info: console.log,
    error: console.error
  };

// Configuration améliorée du transporteur
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT), // Conversion explicite en nombre
  secure: process.env.SMTP_PORT === '465', // true pour 465, false pour 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false // Pour les environnements de test (à éviter en production)
  }
});

// Fonction de vérification améliorée
const verifySMTP = async () => {
  try {
    await transporter.verify();
    logger.info('SMTP Server is ready to send emails');
    return true;
  } catch (error) {
    logger.error('SMTP Configuration Error:', error);
    return false;
  }
};

// Fonction d'envoi d'email
const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `"Nom de l'expéditeur" <${process.env.SMTP_FROM}>`, // Format amélioré
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || '' // Version texte alternative
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    logger.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  verifySMTP
};