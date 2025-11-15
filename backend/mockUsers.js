// USUARIOS REALES del sistema (extraídos de seed.js)
// Incluye usuario administrador con password hasheado

const bcrypt = require('bcryptjs');

// Password hasheado para 'admin123' (bcryptjs con salt 10)
const ADMIN_PASSWORD_HASH = '$2a$10$Ty1J5kB7GEXyabv4BxWxleqwjj.V8mkR3bhD7L6RaqdWkA22SLZS6';

const MOCK_USERS = [
  {
    _id: "admin001",
    username: "admin",
    email: "admin@dejoaromas.com",
    password: ADMIN_PASSWORD_HASH, // Password: admin123
    role: "admin",
    fechaRegistro: new Date("2024-01-01")
  },
  {
    _id: "user001",
    username: "usuario_demo",
    email: "usuario@demo.com",
    password: ADMIN_PASSWORD_HASH, // Password: admin123 (mismo hash para demo)
    role: "user",
    fechaRegistro: new Date("2024-06-01")
  }
];

// Función para validar login
async function validateLogin(email, password) {
  const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    return null;
  }
  
  // Comparar password hasheado
  try {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }
    
    // Retornar usuario sin password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return null;
  }
}

// Función para obtener usuario por email
function getUserByEmail(email) {
  const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return null;
  
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Función para obtener usuario por ID
function getUserById(id) {
  const user = MOCK_USERS.find(u => u._id === id);
  if (!user) return null;
  
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

module.exports = {
  MOCK_USERS,
  validateLogin,
  getUserByEmail,
  getUserById
};
