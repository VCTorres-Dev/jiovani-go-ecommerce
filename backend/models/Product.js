const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
    description: {
    type: String,
    required: false, // Ahora es opcional
  },
    imageURL: {
    type: String,
    required: false, // Ahora es opcional
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'El precio no puede ser negativo'],
  },
    rating: {
    type: Number,
    required: false,
    default: 0,
  },
  reviews: {
    type: Number,
    required: false,
    default: 0,
  },
    gender: {
    type: String,
    required: true,
        enum: ['dama', 'varon', 'unisex'], // Opciones permitidas
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'El stock no puede ser negativo'],
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  tags: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("Product", ProductSchema);
