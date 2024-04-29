const express = require('express');
const router = express.Router();
const sanitizeHtml = require('sanitize-html');
const adminController =  require('../controllers/adminController');

//POST endpoint for login
router.post('/login', adminController.login);

module.exports = router;