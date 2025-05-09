import express from "express";
import connectDB from "./Config/Db.js";
import dotenv from "dotenv";
import UserRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import productRouter from "./routes/product.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());

// const allowedOrigins = ["http://localhost:5173"];

// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("start");
});

app.use("/api/user", UserRouter);
app.use("/api/product", productRouter);
connectDB();
app.listen(PORT, (req, res) => {
  console.log(`server start at port number ${PORT}`);
});

export default app;
