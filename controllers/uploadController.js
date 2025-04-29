const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { query } = require('../config/db');

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const uploadPath = path.join(process.cwd(), 'uploads', 'raw');
      
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
        console.log(`Created directory: ${uploadPath}`);
      }
      
      cb(null, uploadPath);
    } catch (err) {
      console.error('Directory creation error:', err);
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    try {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      const ext = path.extname(file.originalname);
      cb(null, `file-${uniqueSuffix}${ext}`);
    } catch (err) {
      console.error('Filename generation error:', err);
      cb(err);
    }
  }
});

// Middleware de debug
const debugUpload = (req, res, next) => {
  console.log('Headers:', req.headers);
  console.log('Content-Type:', req.headers['content-type']);
  next();
};

// Configuration de Multer
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    console.log('Received file:', {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });

    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only JPEG, PNG and SVG are allowed.'));
    }
    
    if (file.fieldname !== 'file') {
      return cb(new Error(`Unexpected field: expected 'file' but received '${file.fieldname}'`));
    }
    
    cb(null, true);
  }
});

// Handler pour l'upload
exports.handleLocalUpload = [
  debugUpload,
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: { message: 'No file uploaded' }
        });
      }

      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/raw/${req.file.filename}`;
    
      const result = await query(
        `INSERT INTO 3d_projects (
          name,
          description,
          creator_id,
          thumbnail_url,
          status
        ) VALUES (?, ?, ?, ?, ?)`,
        [
          req.file.originalname,
          'Description par défaut',
          req.user.id,
          fileUrl,
          'draft'
        ]
      );

      res.status(201).json({
        success: true,
        data: {
          id: result.insertId,
          fileUrl,
          originalName: req.file.originalname,
          format: path.extname(req.file.originalname)
        }
      });
    } catch (error) {
      console.error('Upload handler error:', error);
      
      const statusCode = error.code === 'LIMIT_FILE_SIZE' ? 413 : 500;
      res.status(statusCode).json({
        success: false,
        error: { 
          message: error.sqlMessage || 'Failed to process upload',
          details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }
      });
    }
  }
];