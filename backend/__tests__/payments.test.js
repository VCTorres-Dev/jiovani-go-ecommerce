const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let app;
let testProduct;
let testUser;
let userToken;

// Mock de Transbank SDK (no queremos llamar a Transbank real en tests)
jest.mock('../config/transbank', () => ({
  transaction: {
    create: jest.fn().mockResolvedValue({
      token: 'mock_token_12345',
      url: 'https://webpay3gint.transbank.cl/webpayserver/initTransaction'
    }),
    commit: jest.fn().mockResolvedValue({
      vci: 'TSY',
      amount: 45000,
      status: 'AUTHORIZED',
      buy_order: 'ORD123456',
      session_id: 'session123',
      card_detail: { card_number: '6623' },
      accounting_date: '1119',
      transaction_date: '2024-11-19T12:00:00.000Z',
      authorization_code: '1213',
      payment_type_code: 'VD',
      response_code: 0,
      installments_number: 0
    }),
    status: jest.fn()
  },
  WebpayPlus: {}
}));

// Mock del servicio de email
jest.mock('../services/emailService', () => ({
  sendOrderConfirmation: jest.fn().mockResolvedValue({
    success: true,
    messageId: 'mock-message-id',
    previewURL: 'https://ethereal.email/message/mock'
  })
}));

const setupApp = () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const paymentRoutes = require('../routes/paymentRoutes');
  app.use('/api/payments', paymentRoutes);

  return app;
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  process.env.JWT_SECRET = 'test_secret_key_12345';
  process.env.NODE_ENV = 'test';
  process.env.FRONTEND_URL = 'http://localhost:3000';

  app = setupApp();
});

beforeEach(async () => {
  // Crear producto de prueba
  testProduct = await Product.create({
    name: 'Perfume Test Payment',
    price: 45000,
    stock: 10,
    gender: 'dama',
    imageURL: '/images/test.webp'
  });

  // Crear usuario de prueba
  // NO hashear manualmente - el modelo User lo hace automáticamente
  testUser = await User.create({
    username: 'paymentuser',
    email: 'payment@test.com',
    password: 'password123',
    role: 'user'
  });

  userToken = jwt.sign(
    { user: { id: testUser._id, email: testUser.email, role: testUser.role } },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  // Limpiar mocks entre tests
  jest.clearAllMocks();
});

afterEach(async () => {
  await Order.deleteMany({});
  await Product.deleteMany({});
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Pagos - Inicialización', () => {
  test('PA-01: Iniciar pago guest con datos válidos', async () => {
    const orderData = {
      orderItems: [{
        _id: testProduct._id,
        name: testProduct.name,
        price: testProduct.price,
        quantity: 2,
        imageURL: testProduct.imageURL
      }],
      totalAmount: 90000,
      shippingInfo: {
        name: 'Juan Pérez',
        email: 'juan@test.com',
        phone: '+56912345678',
        address: 'Av. Principal 123',
        city: 'Santiago',
        region: 'Metropolitana'
      }
    };

    const response = await request(app)
      .post('/api/payments/init-guest')
      .send(orderData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data).toHaveProperty('url');
    expect(response.body.data).toHaveProperty('orderId');
    expect(response.body.data).toHaveProperty('buyOrder');

    // Verificar que la orden se creó en BD
    const order = await Order.findById(response.body.data.orderId);
    expect(order).toBeTruthy();
    expect(order.status).toBe('pending');
    expect(order.totalAmount).toBe(90000);
    expect(order.shippingInfo.name).toBe('Juan Pérez');
  });

  test('PA-02: Iniciar pago falla con stock insuficiente', async () => {
    const orderData = {
      orderItems: [{
        _id: testProduct._id,
        name: testProduct.name,
        price: testProduct.price,
        quantity: 100, // Más de lo disponible
        imageURL: testProduct.imageURL
      }],
      totalAmount: 4500000,
      shippingInfo: {
        name: 'Juan Pérez',
        email: 'juan@test.com',
        phone: '+56912345678',
        address: 'Av. Principal 123',
        city: 'Santiago',
        region: 'Metropolitana'
      }
    };

    const response = await request(app)
      .post('/api/payments/init-guest')
      .send(orderData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Stock insuficiente');
  });

  test('PA-03: Iniciar pago sin orderItems falla', async () => {
    const orderData = {
      orderItems: [],
      totalAmount: 0,
      shippingInfo: {
        name: 'Juan',
        email: 'juan@test.com',
        phone: '123',
        address: 'Dir',
        city: 'City',
        region: 'Region'
      }
    };

    const response = await request(app)
      .post('/api/payments/init-guest')
      .send(orderData)
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  test('PA-04: BuyOrder tiene máximo 26 caracteres', async () => {
    const orderData = {
      orderItems: [{
        _id: testProduct._id,
        name: testProduct.name,
        price: testProduct.price,
        quantity: 1,
        imageURL: testProduct.imageURL
      }],
      totalAmount: 45000,
      shippingInfo: {
        name: 'Test User',
        email: 'test@test.com',
        phone: '+56912345678',
        address: 'Test Address',
        city: 'Test City',
        region: 'Test Region'
      }
    };

    const response = await request(app)
      .post('/api/payments/init-guest')
      .send(orderData)
      .expect(200);

    const buyOrder = response.body.data.buyOrder;
    expect(buyOrder.length).toBeLessThanOrEqual(26);
  });
});

describe('Pagos - Confirmación', () => {
  let pendingOrder;

  beforeEach(async () => {
    // Crear orden pendiente
    pendingOrder = await Order.create({
      user: testUser._id, // Campo requerido por el modelo Order
      products: [{
        product: testProduct._id,
        quantity: 2,
        price: testProduct.price,
        name: testProduct.name,
        imageURL: testProduct.imageURL
      }],
      totalAmount: 90000,
      status: 'pending',
      shippingInfo: {
        name: 'Test User',
        email: 'test@test.com',
        phone: '+56912345678',
        address: 'Test Address',
        city: 'Santiago',
        region: 'Metropolitana'
      },
      transbank: {
        buyOrder: 'ORD123456',
        sessionId: 'session123',
        token: 'mock_token_12345'
      }
    });
  });

  test('PA-05: Confirmar pago exitoso (token_ws)', async () => {
    const response = await request(app)
      .post('/api/payments/confirm')
      .send({ token_ws: 'mock_token_12345' })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('completed');
    expect(response.body.data).toHaveProperty('authorizationCode');

    // Verificar que la orden se actualizó
    const updatedOrder = await Order.findById(pendingOrder._id);
    expect(updatedOrder.status).toBe('completed');

    // Verificar que el stock se descontó
    const updatedProduct = await Product.findById(testProduct._id);
    expect(updatedProduct.stock).toBe(8); // 10 - 2
  });

  test('PA-06: Manejo de cancelación por usuario', async () => {
    const response = await request(app)
      .post('/api/payments/confirm')
      .send({
        TBK_TOKEN: 'mock_token_12345',
        TBK_ORDEN_COMPRA: 'ORD123456',
        TBK_ID_SESION: 'session123'
      })
      .expect(200);

    expect(response.body.success).toBe(false);
    expect(response.body.reason).toBe('cancelled');

    const updatedOrder = await Order.findById(pendingOrder._id);
    expect(updatedOrder.status).toBe('cancelled');
  });

  test('PA-07: Manejo de timeout', async () => {
    const response = await request(app)
      .post('/api/payments/confirm')
      .send({
        TBK_ORDEN_COMPRA: 'ORD123456',
        TBK_ID_SESION: 'session123'
        // Sin tokens = timeout
      })
      .expect(200);

    expect(response.body.success).toBe(false);
    expect(response.body.reason).toBe('timeout');

    const updatedOrder = await Order.findById(pendingOrder._id);
    expect(updatedOrder.status).toBe('timeout');
  });

  test('PA-08: Prevención de doble commit', async () => {
    // Primer commit
    await request(app)
      .post('/api/payments/confirm')
      .send({ token_ws: 'mock_token_12345' })
      .expect(200);

    // Segundo commit (debe ser rechazado o ignorado)
    const response = await request(app)
      .post('/api/payments/confirm')
      .send({ token_ws: 'mock_token_12345' })
      .expect(200);

    // Verificar que no se duplicó el descuento de stock
    const product = await Product.findById(testProduct._id);
    expect(product.stock).toBe(8); // Solo descontó una vez
  });

  test('PA-09: Stock NO se descuenta en pago fallido', async () => {
    // Mock de pago rechazado
    const { transaction } = require('../config/transbank');
    transaction.commit.mockResolvedValueOnce({
      status: 'FAILED',
      response_code: -1,
      buy_order: 'ORD123456'
    });

    await request(app)
      .post('/api/payments/confirm')
      .send({ token_ws: 'mock_token_12345' })
      .expect(200);

    // Stock debe permanecer igual
    const product = await Product.findById(testProduct._id);
    expect(product.stock).toBe(10);
  });
});

describe('Pagos - Health Check', () => {
  test('PA-10: Health check retorna estado del sistema', async () => {
    const response = await request(app)
      .get('/api/payments/health')
      .expect(200);

    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('environment');
  });
});
