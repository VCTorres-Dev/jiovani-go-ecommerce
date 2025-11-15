const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { auth, adminAuth } = require("../middleware/authMiddleware"); // Importa middlewares

// Obtener productos por género con paginación
router.get("/", async (req, res) => {
  try {
    const { gender, page = 1, limit = 10, search = '', includeOutOfStock } = req.query;

    const query = {};
    // Por defecto, solo mostrar productos con stock mayor a 0
    if (includeOutOfStock !== 'true') {
      query.stock = { $gt: 0 };
    }
    // Construcción de la consulta más robusta
    if (gender && gender !== 'undefined' && gender !== '') {
      query.gender = gender;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limitNum);

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    // Estandarizar la respuesta para incluir el total
    res.json({ products, totalPages, currentPage: pageNum, totalProducts });
  } catch (err) {
    console.error(`Error fetching products: ${err.message}`);
    res.status(500).json({ message: `Server Error: ${err.message}` });
  }
});

// Obtener productos destacados con lógica mejorada
router.get("/featured", async (req, res) => {
  try {
    // 1. Intentar obtener productos marcados como destacados
    let featuredProducts = await Product.find({ isFeatured: true }).limit(4);

    // 2. Si no hay destacados, obtener los 4 con mejor rating
    if (featuredProducts.length === 0) {
      featuredProducts = await Product.find({ rating: { $exists: true, $ne: null } })
        .sort({ rating: -1 })
        .limit(4);
    }

    // 3. Si sigue sin haber productos, obtener 4 aleatorios
    if (featuredProducts.length === 0) {
      featuredProducts = await Product.aggregate([{ $sample: { size: 4 } }]);
    }

    res.json(featuredProducts);
  } catch (err) {
    res.status(500).json({ message: `Error al obtener productos destacados: ${err.message}` });
  }
});

// Crear un nuevo producto
router.post("/", [auth, adminAuth], async (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    imageURL: req.body.imageURL,
    gender: req.body.gender,
    rating: req.body.rating,
    stock: req.body.stock, // Asegúrate de incluir el stock al crear un producto
    tags: req.body.tags,
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Obtener un producto por ID
router.get("/:id", getProduct, (req, res) => {
  res.json(res.product);
});

// Actualizar un producto
router.put("/:id", [auth, adminAuth], getProduct, async (req, res) => {
  if (req.body.name != null) {
    res.product.name = req.body.name;
  }
  if (req.body.price != null) {
    res.product.price = req.body.price;
  }
  if (req.body.description != null) {
    res.product.description = req.body.description;
  }
  if (req.body.imageURL != null) {
    res.product.imageURL = req.body.imageURL;
  }
  if (req.body.gender != null) {
    res.product.gender = req.body.gender;
  }
  if (req.body.rating != null) {
    res.product.rating = req.body.rating;
  }
  if (req.body.stock != null) {
    res.product.stock = req.body.stock;
  }
  if (req.body.isFeatured != null) {
    res.product.isFeatured = req.body.isFeatured;
  }
  if (req.body.tags != null) {
    res.product.tags = req.body.tags;
  }

  try {
    const updatedProduct = await res.product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar un producto
router.delete("/:id", [auth, adminAuth], getProduct, async (req, res) => {
  try {
    await res.product.deleteOne();
    res.json({ message: "Deleted Product" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para manejar la compra de un producto
router.post("/buy/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    if (product.stock < 1) {
      return res.status(400).json({ message: "Producto agotado" });
    }
    product.stock -= 1;
    await product.save();
    res.json({ message: "Compra exitosa", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para finalizar la compra (checkout)
router.post("/checkout", auth, async (req, res) => {
  const { cartItems } = req.body;

  try {
    // 1. Verificar el stock de todos los productos antes de hacer cualquier cambio
    for (const item of cartItems) {
      const product = await Product.findById(item._id);
      if (!product) {
        return res.status(404).json({ message: `Producto no encontrado: ${item.name}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Stock insuficiente para ${product.name}` });
      }
    }

    // 2. Si hay stock para todo, actualizar la base de datos
    for (const item of cartItems) {
      await Product.updateOne(
        { _id: item._id },
        { $inc: { stock: -item.quantity } }
      );
    }

    res.json({ message: "Compra realizada con éxito" });

  } catch (error) {
    res.status(500).json({ message: `Error en el servidor: ${error.message}` });
  }
});

// Middleware para obtener un producto por ID
async function getProduct(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.id);
    if (product == null) {
      return res.status(404).json({ message: "Cannot find product" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.product = product;
  next();
}

module.exports = router;
