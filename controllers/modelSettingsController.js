const ModelSettings = require('../models/modelSettings');

const modelSettingsController = {
  async create(req, res) {
    try {
      const settings = await ModelSettings.create(req.body);
      res.status(201).json(settings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const settings = await ModelSettings.findAll();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const settings = await ModelSettings.findById(req.params.id);
      if (!settings) {
        return res.status(404).json({ message: 'Settings not found' });
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async update(req, res) {
    try {
      const settings = await ModelSettings.update(req.params.id, req.body);
      if (!settings) {
        return res.status(404).json({ message: 'Settings not found' });
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async delete(req, res) {
    try {
      await ModelSettings.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = modelSettingsController;