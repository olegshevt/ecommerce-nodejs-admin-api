const { validationResult } = require('express-validator');
const User = require('../../models/user');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signin = (req, res, next) => {
    const email = req.body.email;
    // console.log(email, 'MY EMAIL')
    const password = req.body.password;
    // console.log(password, 'MY PASS')
    let loadedUser;
    User.findOne({ email: email }).then(
        user => {
            // console.log(user, 'DA USER')
            if (!user) {
                const error = new Error('User with this email not found');
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        }
    ).then(isEqual => {
        if (!isEqual) {
            const error = new Error('User with this email not found');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({
            email: loadedUser.email,
            userId: loadedUser._id.toString()
        }, 'supersecrettoken',
            { expiresIn: '1h' });
        const expiresIn = 3600000;
        res.status(200).json({ token: token, userId: loadedUser._id.toString(), expiresIn })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.signup = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    bcrypt.hash(password, 12).then(hashedPass => {
        const user = new User({
            email,
            name,
            password: hashedPass
        });
        return user.save();
    }).then(result => {
        res.status(201).json({
            message: 'Success signup',
            user: result
        })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}