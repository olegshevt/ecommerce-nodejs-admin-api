const User = require('../../models/user');

exports.fetchUser = async (req, res, next) => {
    const userId = req.params.userId;
    console.log(userId, 'MY USERid');
    try {
        const result = await User.findById(userId)
        console.log(result, 'MY RESULT');
        res.status(200).json({
            message: 'User data fetched!',
            user: result
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};



exports.editUser = (req, res, next) => {
    // const userId = req.body.userId;
    // const updatedName = req.body.name;
    // const updatedLastname = req.body.lastname;
    // const updatedPassword = req.body.password;
    // const updatedEmail = req.body.email;

    const userId = req.body.user.userId;
    const updatedName = req.body.user.name;
    const updatedLastname = req.body.user.lastname;
    const updatedPassword = req.body.user.password;
    const updatedEmail = req.body.user.email;

    User.findById(userId)
        .then(user => {
            user.name = updatedName;
            user.lastname = updatedLastname;
            user.password = updatedPassword;
            user.email = updatedEmail;
            return user.save();
        })
        .then(result => {
            res.status(200).json({
                message: 'Edit user succesfull',
                user: result,
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};