const { query } = require('../config/db');
const logger = {
  info: console.log,
  error: console.error
};
const defaultSettings = {
  mainColor: '#FFA000',
  texture: 'smooth',
  shininess: 50,
  lightIntensity: 75,
  shadowIntensity: 50,
  ambientLight: 30,
  rotationSpeed: 50,
  animationType: 'rotate'
};

const getModelSettings = async (req, res) => {
  try {
    const modelId = req.params.id;
    const userId = req.user.id;

    const [model] = await query(
      'SELECT settings FROM 3d_models WHERE id = ? AND project_id IN (SELECT id FROM 3d_projects WHERE creator_id = ?)',
      [modelId, userId]
    );

    if (!model) {
      return res.status(404).json({
        success: false,
        error: { message: 'Model not found' }
      });
    }

    const settings = model.settings ? JSON.parse(model.settings) : defaultSettings;
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    logger.error('Error getting model settings:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get model settings' }
    });
  }
};

const updateModelSettings = async (req, res) => {
  try {
    const modelId = req.params.id;
    const userId = req.user.id;
    const settings = req.body;

    const [model] = await query(
      'SELECT id FROM 3d_models WHERE id = ? AND project_id IN (SELECT id FROM 3d_projects WHERE creator_id = ?)',
      [modelId, userId]
    );

    if (!model) {
      return res.status(404).json({
        success: false,
        error: { message: 'Model not found' }
      });
    }

    await query(
      'UPDATE 3d_models SET settings = ? WHERE id = ?',
      [JSON.stringify(settings), modelId]
    );

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    logger.error('Error updating model settings:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update model settings' }
    });
  }
};

const resetModelSettings = async (req, res) => {
  try {
    const modelId = req.params.id;
    const userId = req.user.id;

    const [model] = await query(
      'SELECT id FROM 3d_models WHERE id = ? AND project_id IN (SELECT id FROM 3d_projects WHERE creator_id = ?)',
      [modelId, userId]
    );

    if (!model) {
      return res.status(404).json({
        success: false,
        error: { message: 'Model not found' }
      });
    }

    await query(
      'UPDATE 3d_models SET settings = ? WHERE id = ?',
      [JSON.stringify(defaultSettings), modelId]
    );

    res.json({
      success: true,
      data: defaultSettings
    });
  } catch (error) {
    logger.error('Error resetting model settings:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to reset model settings' }
    });
  }
};

module.exports = {
  getModelSettings,
  updateModelSettings,
  resetModelSettings
};