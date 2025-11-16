const mongoose = require('mongoose');
const dns = require('dns');

const uri = 'mongodb+srv://dejoaromas:ranked123@jiovani-go.sybsurl.mongodb.net/dejoaromas?retryWrites=true&w=majority';

(async () => {
  try {
    console.log('== SRV resolve check ==');
    dns.resolveSrv('_mongodb._tcp.jiovani-go.sybsurl.mongodb.net', (err, addresses) => {
      if (err) {
        console.error('SRV resolve error:', err);
      } else {
        console.log('SRV addresses:', addresses);
      }
    });

    console.log('\n== Attempting mongoose connect ==');
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 10000 });
    console.log('✅ Mongoose connected to Atlas');
    await mongoose.disconnect();
    console.log('Disconnected');
  } catch (err) {
    console.error('Mongoose connect error:', err);
    process.exit(1);
  }
})();
