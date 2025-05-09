import ProductModel from "../Models/Product.model.js";
export const createProduct = async (req, res) => {
  try {
    const { name, image, price, public: isPublic } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Name and price are required",
      });
    }

    const product = new ProductModel({
      name,
      image: image || [],
      price,

      public: isPublic !== undefined ? isPublic : true,
    });

    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      error: false,
      message: "Product created successfully",
      data: savedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      error: false,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json({
      success: true,
      message: "All products fetched",
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deleted = await ProductModel.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      error: false,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};

// ✅ 6. [Optional] Search Product by Text
export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    const results = await ProductModel.find({
      $text: { $search: query },
    });

    res.status(200).json({
      success: true,
      error: false,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};
