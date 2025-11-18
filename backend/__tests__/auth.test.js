const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Setup de base de datos en memoria
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let app;

// Configurar Express app para tests
const setupApp = () => {
  const app = express();
  app.use(express.json());

  // Importar rutas de autenticación
  const authRoutes = require('../routes/authRoutes');
  app.use('/api/auth', authRoutes);

  return app;
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  process.env.JWT_SECRET = 'test_secret_key_12345';
  app = setupApp();
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Autenticación - Registro', () => {
  test('AU-01: Registro exitoso con datos válidos', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('email', 'test@example.com');
    expect(response.body.user).toHaveProperty('username', 'testuser');
    expect(response.body.user).not.toHaveProperty('password');

    // Verificar que usuario existe en BD
    const userInDb = await User.findOne({ email: 'test@example.com' });
    expect(userInDb).toBeTruthy();
    expect(userInDb.username).toBe('testuser');
  });

  test('AU-02: Registro falla con email duplicado', async () => {
    // Crear usuario existente
    // NO hashear manualmente - el modelo User lo hace automáticamente
    await User.create({
      username: 'existing',
      email: 'existing@example.com',
      password: 'password123'
    });

    const userData = {
      username: 'newuser',
      email: 'existing@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(400);

    expect(response.body.message).toContain('existe');
  });

  test('AU-03: Registro falla sin campos requeridos', async () => {
    const userData = {
      username: 'testuser'
      // Falta email y password
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(400);

    expect(response.body).toHaveProperty('message');
  });
});

describe('Autenticación - Login', () => {
  beforeEach(async () => {
    // Crear usuario para tests de login
    // NO hashear manualmente - el modelo User lo hace automáticamente
    await User.create({
      username: 'logintest',
      email: 'login@example.com',
      password: 'correctpassword',
      role: 'user'
    });
  });

  test('AU-04: Login exitoso con credenciales correctas', async () => {
    const credentials = {
      email: 'login@example.com',
      password: 'correctpassword'
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(credentials)
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('email', 'login@example.com');

    // Verificar que el token es válido
    const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);
    expect(decoded).toHaveProperty('user');
    expect(decoded.user).toHaveProperty('id');
  });

  test('AU-05: Login falla con password incorrecto', async () => {
    const credentials = {
      email: 'login@example.com',
      password: 'wrongpassword'
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(credentials)
      .expect(400);

    expect(response.body.message).toContain('inválidas');
  });

  test('AU-06: Login falla con email inexistente', async () => {
    const credentials = {
      email: 'nonexistent@example.com',
      password: 'anypassword'
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(credentials)
      .expect(400);

    expect(response.body.message).toContain('inválidas');
  });
});

describe('Autenticación - Middleware', () => {
  let validToken;
  let adminToken;

  beforeEach(async () => {
    // Usuario normal
    // NO hashear manualmente - el modelo User lo hace automáticamente
    const user = await User.create({
      username: 'normaluser',
      email: 'user@example.com',
      password: 'password123',
      role: 'user'
    });

    // Usuario admin
    const admin = await User.create({
      username: 'adminuser',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });

    // Generar tokens
    validToken = jwt.sign(
      { user: { id: user._id, email: user.email, role: user.role } },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    adminToken = jwt.sign(
      { user: { id: admin._id, email: admin.email, role: admin.role } },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
  });

  test('AU-07: Acceso a ruta protegida sin token falla', async () => {
    const response = await request(app)
      .get('/api/auth/user')
      .expect(401);

    expect(response.body.message).toContain('token');
  });

  test('AU-08: Acceso a ruta protegida con token válido', async () => {
    const response = await request(app)
      .get('/api/auth/user')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(200);

    expect(response.body.user).toHaveProperty('email', 'user@example.com');
  });

  test('AU-09: Token expirado es rechazado', async () => {
    const expiredToken = jwt.sign(
      { user: { id: 'someid' } },
      process.env.JWT_SECRET,
      { expiresIn: '0s' }
    );

    // Esperar un momento para que expire
    await new Promise(resolve => setTimeout(resolve, 100));

    const response = await request(app)
      .get('/api/auth/user')
      .set('Authorization', `Bearer ${expiredToken}`)
      .expect(401);

    expect(response.body.message).toContain('expirado');
  });
});
