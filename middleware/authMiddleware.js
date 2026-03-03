const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        console.log(req.body);
        next();
    }
    catch (eror) {
        res.status(401).json({
            status: 'fail',
            messege: 'Invalid or expired token'
        });
    }
};