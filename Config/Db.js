import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb+srv://abesecomllp25:DZZLiugYZqYwG3wQ@cluster0.t00vlql.mongodb.net/";

const ConnectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: "ECOM_main" });

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default ConnectDB;
