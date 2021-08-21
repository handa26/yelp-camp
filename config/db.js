const mongoose = require("mongoose");

const connectDB = async () => {
  const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelpCampDB";
  try {
    const connect = await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log(`MongoDB connected: ${connect.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
