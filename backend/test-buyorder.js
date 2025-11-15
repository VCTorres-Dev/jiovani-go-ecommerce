// Test simple para verificar la longitud del buyOrder
const mongoose = require('mongoose');
const Order = require('./models/Order');

// Test sin conectar a DB
function testBuyOrderLength() {
  console.log('🧪 TESTING BUYORDER LENGTH');
  console.log('=' .repeat(30));
  
  const testUserId = '684e72208d209416487ec6db';
  
  for (let i = 0; i < 5; i++) {
    const buyOrder = `ORD${Date.now().toString().slice(-8)}${testUserId.slice(-6)}${Math.random().toString(36).substr(2, 6)}`.toUpperCase();
    console.log(`Test ${i + 1}:`);
    console.log(`  BuyOrder: ${buyOrder}`);
    console.log(`  Length: ${buyOrder.length} caracteres`);
    console.log(`  Valid: ${buyOrder.length <= 26 ? '✅' : '❌'}`);
    console.log('');
  }
}

testBuyOrderLength();
