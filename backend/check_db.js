const mongoose = require('mongoose');
const Product = require('./models/Product');

async function checkProducts() {
  try {
    await mongoose.connect('mongodb://localhost:27017/Dejo_Aromas');
    console.log('Conectado a MongoDB');
    
    const products = await Product.find({}).limit(3);
    console.log(`Encontrados ${products.length} productos:`);
    
    products.forEach((product, index) => {
      console.log(`\n--- Producto ${index + 1} ---`);
      console.log('Nombre:', product.name);
      console.log('imageURL:', product.imageURL);
      console.log('imageUrl:', product.imageUrl);
      console.log('image:', product.image);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkProducts();
