const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({ messege: 'Authorization token is required with Bearer' });
        }

        next();
    }
    catch (eror) {
        res.status(401).json({
            status: 'failed',
            messege: 'Invalid or expired token'
        });
    }
};