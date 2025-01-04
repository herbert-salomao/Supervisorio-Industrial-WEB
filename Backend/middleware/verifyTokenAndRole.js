const SECRET_KEY = 'senai-projeto-integrador';


const jwt = require('jsonwebtoken');
const verifyTokenAndRole = (roles) => {
    return (req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(403).json({ message: 'No token provided' });
        }

        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Failed to authenticate token' });
            }

            // Check if user's role is allowed
            if (!roles.includes(decoded.role)) {
                return res.status(403).json({ message: 'You do not have permission' });
            }

            req.user = decoded; // Store decoded user information
            next();
        });
    };
};

module.exports = verifyTokenAndRole;