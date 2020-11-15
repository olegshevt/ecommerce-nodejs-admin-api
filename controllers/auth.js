const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}));

exports.getLogin = (req, res, next) => {

    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message,
        oldInputs: { email: '', password: '' },
        validationErrors: []
    });

};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg,
            oldInputs: { email: email, password: password },
            validationErrors: errors.array()
        });
    } else {
        User.findOne({ email: email }).then(user => {
            if (!user) {
                return res.status(422).render('auth/login', {
                    path: '/login',
                    pageTitle: 'Login',
                    errorMessage: errors.array()[0].msg,
                    oldInputs: { email: email, password: password },
                    validationErrors: errors.array()
                });
            }
            bcrypt.compare(password, user.password).then(match => {
                if (match) {
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    return req.session.save(err => {
                        console.log(err);
                        res.redirect('/');
                    });
                }
                req.flash('error', 'Invalid email or password.');
                res.redirect('/login');
            })
        })
            .catch(err => console.log(err));
    }
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
};

exports.getSignup = (req, res, next) => {

    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message,
        oldInputs: { email: '', password: '', confirmPassword: '' },
        validationErrors: []
    });

};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInputs: { email: email, password: password, confirmPassword: confirmPassword },
            validationErrors: errors.array()
        });
    }
    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: { items: [] }
            });
            return user.save();
        }).then(result => {
            res.redirect('/login');
            // return transporter.sendMail({
            //     to: email,
            //     from: 'olegshevt@gmail.com',
            //     subject: 'Signup succeeded!',
            //     html: '<h1>Success in sign up!</h1>'
            // })
        }).catch(err => { console.log(err); })
}

exports.getReset = (req, res, next) => {

    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset password',
        errorMessage: message
    });

};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {

        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        console.log(token);
        User.findOne({ email: req.body.email }).then(user => {
            if (!user) {
                req.flash('error', 'No account with that email found.');
                return res.redirect('/reset');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save();
        }).then(result => {
            res.redirect('/');
            // transporter.sendMail({
            //     to: req.body.email,
            //     from: 'olegshevt@gmail.com',
            //     subject: 'Password reset!',
            //     html: `<p>You requested a password reset.</p>
            //     <p>Click this <a href="http://localhost:3000/reset/${token}">Link</a> to set a new password.</p>`
            // })

        }).catch(err => { console.log(err); })
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postNewPassword = (req, res, next) => {

    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;

    let newUser;

    User.findOne({
        _id: userId,
        resetToken: passwordToken,
        resetTokenExpiration: { $gt: Date.now() }
    }).then(user => {
        newUser = user;
        return bcrypt.hash(newPassword, 12);

    }).then(hashedPassword => {
        newUser.password = hashedPassword;
        newUser.resetToken = undefined;
        newUser.resetTokenExpiration = undefined;
        return newUser.save();
    }).then(result => {
        res.redirect('/login')
    }).catch(err => { console.log(err) })
}