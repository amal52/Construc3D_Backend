const mysql = require('mysql2');
const { pool } = require('../config/db');

class ModelSettings {
  static async create(settings) {
    const [result] = await pool.query(
      `INSERT INTO model_settings 
       (name, color, texture, shininess, light_intensity, ambient_light, 
        shadow_intensity, rotation_speed, animation_type, obj_url, glb_url, 
        thumbnail, images, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [settings.name, settings.color, settings.texture, settings.shininess,
       settings.lightIntensity, settings.ambientLight, settings.shadowIntensity,
       settings.rotationSpeed, settings.animationType, settings.objUrl,
       settings.glbUrl, settings.thumbnail, JSON.stringify(settings.images || []),
       JSON.stringify(settings.notes || [])]
    );
    return { id: result.insertId, ...settings };
  }

  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM model_settings ORDER BY created_at DESC');
    return rows.map(row => ({
      ...row,
      images: JSON.parse(row.images || '[]'),
      notes: JSON.parse(row.notes || '[]')
    }));
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM model_settings WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    const settings = rows[0];
    return {
      ...settings,
      images: JSON.parse(settings.images || '[]'),
      notes: JSON.parse(settings.notes || '[]')
    };
  }

  static async update(id, settings) {
    await pool.query(
      `UPDATE model_settings 
       SET name = ?, color = ?, texture = ?, shininess = ?, 
           light_intensity = ?, ambient_light = ?, shadow_intensity = ?,
           rotation_speed = ?, animation_type = ?, obj_url = ?, 
           glb_url = ?, thumbnail = ?, images = ?, notes = ?
       WHERE id = ?`,
      [settings.name, settings.color, settings.texture, settings.shininess,
       settings.lightIntensity, settings.ambientLight, settings.shadowIntensity,
       settings.rotationSpeed, settings.animationType, settings.objUrl,
       settings.glbUrl, settings.thumbnail, JSON.stringify(settings.images || []),
       JSON.stringify(settings.notes || []), id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    await pool.query('DELETE FROM model_settings WHERE id = ?', [id]);
  }
}

module.exports = ModelSettings;