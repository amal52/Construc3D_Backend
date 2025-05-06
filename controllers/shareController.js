const { query } = require('../config/db');
const emailService = require('../email.service');
const logger = {
  info: console.log,
  error: console.error
};

const shareModel = async (req, res) => {
  try {
    const { modelId, email, permission } = req.body;
    const userId = req.user.id;

    // Vérification des permissions
    const [model] = await query(
      `SELECT m.project_id, m.name, u.email as sender_email
       FROM 3d_models m
       JOIN 3d_projects p ON m.project_id = p.id
       JOIN 3d_users u ON p.creator_id = u.id
       WHERE m.id = ? AND p.creator_id = ?`,
      [modelId, userId]
    );

    if (!model) {
      return res.status(403).json({
        success: false,
        error: { message: 'Access denied or model not found' }
      });
    }

    // Vérification de l'utilisateur invité
    const [invitedUser] = await query(
      'SELECT id FROM 3d_users WHERE email = ? LIMIT 1',
      [email]
    );

    if (!invitedUser) {
      return res.status(404).json({
        success: false,
        error: { message: 'User with this email does not exist' }
      });
    }

    // Vérification des doublons
    const [existingShare] = await query(
      'SELECT id FROM 3d_collaborators WHERE project_id = ? AND user_id = ?',
      [model.project_id, invitedUser.id]
    );

    if (existingShare) {
      return res.status(409).json({
        success: false,
        error: { message: 'User already has access to this project' }
      });
    }

    // Insertion du partage
    await query(
      'INSERT INTO 3d_collaborators (project_id, user_id, role) VALUES (?, ?, ?)',
      [model.project_id, invitedUser.id, permission]
    );

    // Envoi de l'email
    await emailService.sendShareInvitation(
      modelId,
      model.sender_email,
      email,
      permission
    );

    res.status(200).json({
      success: true,
      message: 'Invitation sent successfully'
    });

  } catch (error) {
    logger.error('Share error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error sharing model' }
    });
  }
};


const getSharedUsers = async (req, res) => {
  try {
    const { modelId } = req.params;
    const userId = req.user.id;

    const shares = await query(
      `SELECT c.*, u.email 
       FROM 3d_collaborators c
       LEFT JOIN 3d_users u ON c.user_id = u.id
       WHERE c.project_id = (SELECT project_id FROM 3d_models WHERE id = ?)
       AND (
         ? IN (SELECT creator_id FROM 3d_projects WHERE id = c.project_id)
         OR c.user_id = ?
       )`,
      [modelId, userId, userId]
    );

    res.status(200).json({
      success: true,
      data: shares
    });
  } catch (error) {
    logger.error('Error getting shared users:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error retrieving shared users' }
    });
  }
};

const updateSharePermission = async (req, res) => {
  try {
    const { shareId } = req.params;
    const { permission } = req.body;
    const userId = req.user.id;

    const result = await query(
      `UPDATE 3d_collaborators 
       SET role = ?
       WHERE id = ? AND project_id IN (
         SELECT id FROM 3d_projects WHERE creator_id = ?
       )`,
      [permission, shareId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Share not found or access denied' }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Permission updated successfully'
    });
  } catch (error) {
    logger.error('Error updating share permission:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error updating permission' }
    });
  }
};

const removeShare = async (req, res) => {
  try {
    const { shareId } = req.params;
    const userId = req.user.id;

    const result = await query(
      `DELETE FROM 3d_collaborators 
       WHERE id = ? AND project_id IN (
         SELECT id FROM 3d_projects WHERE creator_id = ?
       )`,
      [shareId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Share not found or access denied' }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Share removed successfully'
    });
  } catch (error) {
    logger.error('Error removing share:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Error removing share' }
    });
  }
};

module.exports = {
  shareModel,
  getSharedUsers,
  updateSharePermission,
  removeShare
};