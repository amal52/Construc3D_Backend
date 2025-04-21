
        const pool = require('../config/db');
        const jwt = require('jsonwebtoken');
        require('dotenv').config();
        
        exports.login = async (req, res) => {
        const { email, password } = req.body;
        
        try {
            console.log('Données reçues du frontend :', { email, password, token});

            const lowerEmail = email.toLowerCase();
        
            const [users] = await pool.execute('SELECT * FROM 3d_users WHERE LOWER(email) = ?', [lowerEmail]);
            console.log('Utilisateurs récupérés depuis la base de données :', users); 
            
            if (users.length === 0) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const user = users[0];
        
            if (password !== user.password) {
                return res.status(401).json({ error: 'Probleme de comparaison des mots de passe' });
            }
        
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email
                },
                process.env.JWT_SECRET,
            );
            
            await pool.execute(
                'UPDATE 3d_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
                [user.id]
            );
        
            res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                },
            });
        }catch (error) {
                console.error('Erreur dans la fonction login :', error.message);
                res.status(500).json({ error: `Erreur interne : ${error.message}` });
        }
};