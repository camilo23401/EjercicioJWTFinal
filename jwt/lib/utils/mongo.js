const mongoose = require('mongoose');
const uri = process.env.DB_URI;

async function connectDB() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log('MongoDB is Connected');
  } catch (err) {
    console.error(err);
  }
}
exports.connectDB = connectDB;