const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();



const hashedAdminPassword = bcrypt.hashSync('adminPassword', 10); // Example hashed password
const hashedUserPassword = bcrypt.hashSync('userPassword', 10); // Example hashed password


// Dummy user data
const users = [
  { id: 1, username: 'admin', password: '$2a$10$e2eWEES5KFdD2f7YUrO/9.O5tXftb8I1XeZowRdNNZiVGGzSbl09S', role: 'manutenedor' },
  { id: 2, username: 'user', password: '$2a$10$EubYOzwQjGixTm2OxyMgO.Xwx1m/UdYk/tl1qUZnADROGA9KfECKW', role: 'operador' }
];

// Login endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  bcrypt.compare(password, user.password, (err, isMatch) => {
    if (err || !isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  });
});

module.exports = router;
