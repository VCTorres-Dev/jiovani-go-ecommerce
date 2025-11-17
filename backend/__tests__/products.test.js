const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let app;
let adminToken;
let userToken;

const setupApp = () => {
  const app = express();
  app.use(express.json());

  const productRoutes = require('../routes/productRoutes');
  app.use('/api/products', productRoutes);

  return app;
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  process.env.JWT_SECRET = 'test_secret_key_12345';
  app = setupApp();
});

beforeEach(async () => {
  // Crear admin y user para tests
  const admin = await User.create({
    username: 'admin',
    email: 'admin@test.com',
    password: await bcrypt.hash('admin123', 10),
    role: 'admin'
  });

  const user = await User.create({
    username: 'user',
    email: 'user@test.com',
    password: await bcrypt.hash('user123', 10),
    role: 'user'
  });

  adminToken = jwt.sign(
    { user: { id: admin._id, email: admin.email, role: admin.role } },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  userToken = jwt.sign(
    { user: { id: user._id, email: user.email, role: user.role } },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  // Crear productos de prueba
  await Product.create([
    {
      name: 'Perfume Dama Elegante',
      description: 'Fragancia floral para mujer',
      price: 45000,
      stock: 10,
      gender: 'dama',
      imageURL: '/images/dama_1.webp',
      rating: 4.5,
      reviews: 20,
      isFeatured: true
    },
    {
      name: 'Perfume Varón Intenso',
      description: 'Fragancia amaderada para hombre',
      price: 52000,
      stock: 5,
      gender: 'varon',
      imageURL: '/images/varon_1.webp',
      rating: 4.8,
      reviews: 15,
      isFeatured: false
    },
    {
      name: 'Perfume Unisex Fresh',
      description: 'Fragancia cítrica unisex',
      price: 38000,
      stock: 0, // Sin stock
      gender: 'unisex',
      imageURL: '/images/unisex_1.webp',
      rating: 4.2,
      reviews: 8,
      isFeatured: false
    }
  ]);
});

afterEach(async () => {
  await Product.deleteMany({});
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Productos - Listado público', () => {
  test('PR-01: Listar productos retorna array', async () => {
    const response = await request(app)
      .get('/api/products')
      .expect(200);

    expect(Array.isArray(response.body.products)).toBe(true);
    expect(response.body.products.length).toBeGreaterThan(0);
  });

  test('PR-02: Filtrar por género dama', async () => {
    const response = await request(app)
      .get('/api/products?gender=dama')
      .expect(200);

    expect(response.body.products.length).toBe(1);
    expect(response.body.products[0].gender).toBe('dama');
    expect(response.body.products[0].name).toContain('Dama');
  });

  test('PR-03: Filtrar por género varon', async () => {
    const response = await request(app)
      .get('/api/products?gender=varon')
      .expect(200);

    expect(response.body.products.length).toBe(1);
    expect(response.body.products[0].gender).toBe('varon');
  });

  test('PR-04: Búsqueda por nombre', async () => {
    const response = await request(app)
      .get('/api/products?search=Elegante')
      .expect(200);

    expect(response.body.products.length).toBe(1);
    expect(response.body.products[0].name).toContain('Elegante');
  });

  test('PR-05: Productos sin stock excluidos por defecto', async () => {
    const response = await request(app)
      .get('/api/products')
      .expect(200);

    // El producto con stock=0 no debe aparecer
    const outOfStockProduct = response.body.products.find(p => p.stock === 0);
    expect(outOfStockProduct).toBeUndefined();
  });

  test('PR-06: Incluir productos sin stock cuando se solicita', async () => {
    const response = await request(app)
      .get('/api/products?includeOutOfStock=true')
      .expect(200);

    // Ahora debe incluir el producto sin stock
    expect(response.body.products.length).toBe(3);
  });

  test('PR-07: Productos destacados (featured)', async () => {
    const response = await request(app)
      .get('/api/products/featured')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach(product => {
      expect(product.isFeatured).toBe(true);
    });
  });
});

describe('Productos - Operaciones Admin', () => {
  test('PR-08: Crear producto con token admin', async () => {
    const newProduct = {
      name: 'Nuevo Perfume Test',
      description: 'Descripción del perfume',
      price: 60000,
      stock: 20,
      gender: 'dama',
      imageURL: '/images/test.webp'
    };

    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newProduct)
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe('Nuevo Perfume Test');
    expect(response.body.price).toBe(60000);
  });

  test('PR-09: Crear producto sin token falla', async () => {
    const newProduct = {
      name: 'Producto Sin Auth',
      price: 50000,
      stock: 10
    };

    await request(app)
      .post('/api/products')
      .send(newProduct)
      .expect(401);
  });

  test('PR-10: Usuario normal no puede crear productos', async () => {
    const newProduct = {
      name: 'Producto User',
      price: 50000,
      stock: 10,
      gender: 'dama'
    };

    await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${userToken}`)
      .send(newProduct)
      .expect(403);
  });

  test('PR-11: Actualizar producto existente', async () => {
    const product = await Product.findOne({ name: 'Perfume Dama Elegante' });

    const response = await request(app)
      .put(`/api/products/${product._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 55000 })
      .expect(200);

    expect(response.body.price).toBe(55000);
  });

  test('PR-12: Eliminar producto', async () => {
    const product = await Product.findOne({ name: 'Perfume Varón Intenso' });

    await request(app)
      .delete(`/api/products/${product._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    // Verificar que fue eliminado
    const deletedProduct = await Product.findById(product._id);
    expect(deletedProduct).toBeNull();
  });
});

describe('Productos - Validaciones', () => {
  test('PR-13: Precio debe ser número positivo', async () => {
    const invalidProduct = {
      name: 'Producto Inválido',
      price: -100,
      stock: 10,
      gender: 'dama'
    };

    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(invalidProduct);

    // Puede ser 400 o 500 dependiendo de la validación de Mongoose
    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  test('PR-14: Stock no puede ser negativo', async () => {
    const invalidProduct = {
      name: 'Producto Stock Negativo',
      price: 50000,
      stock: -5,
      gender: 'dama'
    };

    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(invalidProduct);

    expect(response.status).toBeGreaterThanOrEqual(400);
  });
});
