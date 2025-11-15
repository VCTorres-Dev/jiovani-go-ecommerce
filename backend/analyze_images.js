const mongoose = require('mongoose');
require('dotenv').config();

async function analyzeImageData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    const productSchema = new mongoose.Schema({}, { strict: false });
    const Product = mongoose.model('Product', productSchema);
    
    console.log('\n🔍 ANÁLISIS DE IMÁGENES:');
    
    const sampleProducts = await Product.find({}).limit(3);
    console.log('\n📦 PRODUCTOS DE MUESTRA:');
    
    sampleProducts.forEach((product, index) => {
      console.log(`\n--- Producto ${index + 1} ---`);
      console.log('name:', product.name);
      console.log('imageURL:', product.imageURL);
      console.log('imageUrl:', product.imageUrl);
      console.log('image:', product.image);
      console.log('_id:', product._id);
    });
    
    // También verificar una orden reciente
    const orderSchema = new mongoose.Schema({}, { strict: false });
    const Order = mongoose.model('Order', orderSchema);
    
    const recentOrder = await Order.findOne().sort({ createdAt: -1 });
    if (recentOrder) {
      console.log('\n📋 ORDEN MÁS RECIENTE:');
      console.log('createdAt:', recentOrder.createdAt);
      console.log('products:', JSON.stringify(recentOrder.products, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

analyzeImageData();
