const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const { 
  getModelSettings,
  updateModelSettings,
  resetModelSettings
} = require('../controllers/modelController');

router.get('/:id/settings', authenticateToken, getModelSettings);
router.put('/:id/settings', authenticateToken, updateModelSettings);
router.post('/:id/settings/reset', authenticateToken, resetModelSettings);

module.exports = router;