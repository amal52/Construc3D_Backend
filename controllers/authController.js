const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const logger = {
    info: console.log,
    error: console.error
  };
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Email and password are required' } 
      });
    }

    // Get user
    const users = await query(
      'SELECT id, email, password, settings, last_login FROM 3d_users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        success: false, 
        error: { message: 'Invalid credentials' } 
      });
    }

    const user = users[0];

    // // Compare password
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(401).json({ 
    //     success: false, 
    //     error: { message: 'les password ne sont pas identique ' } 
    //   });
    // }
    // console.log('Comparaison de mot de passe:', isMatch);


    // Generate JWT token
    const token = jwt.sign(
    { 
        id: user.id, 
        email: user.email
    },
        process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbWFsLmJlbGhhanNhbGFoMjAwM0BnbWFpbC5jb20iLCJpYXQiOjE3NDU4MzQyMTZ9.i9QVZ4l-Ay6K4XbYUaQxKRlP2YEOm8bENWYd_6GTwIU',
    );

    // Update last login
    await query(
        'UPDATE 3d_users SET last_login = NOW() WHERE id = ?',
        [user.id]
    );

    res.status(200).json({
        success: true,
        data: {
            id: user.id,
            email: user.email,
            password: user.password,
            settings: user.settings,
            token
        }
    });
} catch (error) {
    logger.error('Login error:', error);
    next(error);
}
};

module.exports = {
    login
};