const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../pool');

exports.login= (req, res) =>{
    const { username, password } = req.body;
    const query = 'SELECT * FROM Admin WHERE username = ?';
    pool.query(query, [username], (error,results) =>{
        if(error){
            return res.status(500).send('Database error');
        }
        if(results.length >0){
            const comparison = bcrypt.compareSync(password, results[0].password_hash);
            if(comparison){
                const token = jwt.sign({id: results[0].id}, 'secret_key', { expiresIn: '1h'});
                res.json({token: token});
            }else{
                res.status(401).send('invalid login');
            }
        }else{
            res.status(404).send('user not found');
        }
    });
};