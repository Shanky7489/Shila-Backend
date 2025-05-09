import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/product.controller.js";
import isAuthenticated from "../middlewares/auth.js";

const productRouter = Router();

productRouter.post("/create-products", isAuthenticated, createProduct);
productRouter.get("/getproductbyid/:id", isAuthenticated, getProductById);
productRouter.get("/getall-products", isAuthenticated, getAllProducts);
productRouter.put("/update-product/:id", isAuthenticated, updateProduct);
productRouter.delete("/delete-product/:id", isAuthenticated, deleteProduct);

export default productRouter;
