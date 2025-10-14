// db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const dbConnect = () => {
  mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("DB connected successfully."))
    .catch((error) => {
      console.log("DB connection failed!");
      console.log(error.message);
      process.exit(1);
    });
};
