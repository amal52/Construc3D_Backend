const express = require('express');
const router = express.Router();
const modelSettingsController = require('../controllers/modelSettingsController');

router.post('/', modelSettingsController.create);
router.get('/', modelSettingsController.getAll);
router.get('/:id', modelSettingsController.getById);
router.put('/:id', modelSettingsController.update);
router.delete('/:id', modelSettingsController.delete);

module.exports = router;