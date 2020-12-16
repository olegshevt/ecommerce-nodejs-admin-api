const express = require('express');
const authController = require('../../controllers/api/auth');
const { body } = require('express-validator');
const router = express.Router();

router.post('/signin', authController.signin);
router.put('/signup', authController.signup);

module.exports = router;