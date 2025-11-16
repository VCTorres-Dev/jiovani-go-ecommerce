const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', false);

const uri = process.env.MONGODB_URI || 'mongodb://dejoaromas:ranked123@ac-7suoshp-shard-00-00.sybsurl.mongodb.net:27017,ac-7suoshp-shard-00-01.sybsurl.mongodb.net:27017,ac-7suoshp-shard-00-02.sybsurl.mongodb.net:27017/dejoaromas?ssl=true&authSource=admin&retryWrites=true&w=majority';

(async () => {
  try {
    console.log('Trying to connect with URI: (masked)');
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected (non-SRV)');
    await mongoose.disconnect();
    console.log('Disconnected');
  } catch (err) {
    console.error('Connect (non-SRV) error:', err);
    process.exit(1);
  }
})();
