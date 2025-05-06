const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const { shareModel,getSharedUsers,updateSharePermission,removeShare } = require('../controllers/shareController');

router.post('/', authenticateToken, shareModel);
router.get('/:modelId/users', authenticateToken, getSharedUsers);
router.put('/:shareId/permission', authenticateToken, updateSharePermission);
router.delete('/:shareId', authenticateToken, removeShare);

module.exports = router;