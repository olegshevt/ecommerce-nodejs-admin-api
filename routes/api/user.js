const express = require('express');
const userController = require('../../controllers/api/user');
const { body } = require('express-validator');
const router = express.Router();

router.post('/edit-user', userController.editUser);
router.get('/user/:userId', userController.fetchUser);

module.exports = router;