const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../pool');
const sanitizeHtml = require('sanitize-html');

exports.login= (req, res) =>{
    let { username, password } = req.body;
    username = sanitizeHtml(username);
    const query = 'SELECT * FROM Admin WHERE username = ?';
    pool.query(query, [username], (error,results) =>{
        if(error){
            return res.status(500).json({message:'Database error'});
        }
        if(results.length >0){
            const comparison = bcrypt.compareSync(password, results[0].password_hash);
            if(comparison){
                const token = jwt.sign({id: results[0].id}, 'secret_key', { expiresIn: '1h'});
                res.json({token: token});
            }else{
                res.status(401).json({message: 'invalid login'});
            }
        }else{
            res.status(404).json({message: 'user not found'});
        }
    });
};