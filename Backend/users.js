const bcrypt = require('bcryptjs');

const users = {
  mantenedor: {
    username: 'mantenedor',
    password: bcrypt.hashSync('automated@senai201', 8),
    role: 'admin'
  },
  operador: {
    username: 'operador',
    password: bcrypt.hashSync('operacao@senai201', 8),
    role: 'admin'
  },
  visitante: {
    username: 'visitante',
    password: bcrypt.hashSync('123', 8),
    role: 'user'
  }
};

module.exports = { users };
