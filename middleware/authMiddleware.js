const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token required' });
        }

        const token = authHeader.split(' ')[1];

        // Use the same secret you used in your login/register logic
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');

        // This makes req.user available in your controller
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};