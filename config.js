const mongoose = require('mongoose');

const connectDB = async () => {
  console.log("hai",process.env.DB_USER)
  try {
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@trialmern.5ocftsh.mongodb.net/?retryWrites=true&w=majority&appName=trialmern`;
    const res=await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(res)
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
