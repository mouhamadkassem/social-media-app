const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("your application is connect");
  } catch (error) {
    console.log("Error: ", error?.message);
  }
};

module.exports = connectDb;
