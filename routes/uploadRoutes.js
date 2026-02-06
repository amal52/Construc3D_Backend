const express = require('express');
const router = express.Router();
const { handleLocalUpload } = require('../controllers/uploadController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.post('/local',  authenticateToken, handleLocalUpload);

module.exports = router;