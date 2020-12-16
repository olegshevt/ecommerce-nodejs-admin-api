// module.exports = (req, res, next) => {
module.exports = function (userRole) {
    return function (req, res, next) {
        if (!req.session.user) {
            return res.redirect('/login');
        }
        const user = req.session.user;
        if (user && user.role === userRole) {
            next();
        } else {
            console.log('error');
            res.redirect('/')
        }
    };
};