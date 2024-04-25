const express = require('express');
const router = express.Router();
const adminController =  require('../controllers/adminController');

//POST endpoint for login
router.post('/login', adminController.login);

module.exports = router;