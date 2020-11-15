const express = require('express');
const { check, body } = require('express-validator');

const router = express.Router();

const authController = require('../controllers/auth');
const user = require('../models/user');

router.get('/login', authController.getLogin);
router.post('/login', [check('email').isEmail().normalizeEmail()
    .withMessage('Please enter a valid email'), body('password', 'Please enter a correct password.')
        .isLength({ min: 5 }).trim()
        .isAlphanumeric()], authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup', [check('email').isEmail().normalizeEmail()
    .withMessage('Please enter a valid email')
    .custom((value, { req }) => {
        return user.findOne({ email: value }).then(userDoc => {
            if (userDoc) {
                return Promise.reject(
                    'E-Mail exists already, please pick a different one.'
                );
            }
        });
    }),
body('password', 'Please enter a new password with only numbers and text.')
    .isLength({ min: 5 })
    .isAlphanumeric().trim(),
body('confirmPassword').trim().custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error('Passwords have to match!');
    }
    return true;
})
], authController.postSignup);

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
