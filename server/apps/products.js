import { Router } from "express";
import { db } from "../utils/db.js";
import pkg from "mongodb";
const { ObjectId, BSONError } = pkg;

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Fetching products with pagination
    const products = await db
      .collection("products")
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Get the total count of products
    const totalCount = await db.collection("products").countDocuments();

    res.json({ data: products, totalCount });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

productRouter.post("/", async (req, res) => {
  try {
    const { name, price, image, description, category } = req.body;

    // Validate required fields
    if (!name || !price || !image || !description || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create new product object
    const newProduct = {
      name,
      price: Number(price),
      image,
      description,
      category,
    };

    // Insert the new product into the database
    const result = await db.collection("products").insertOne(newProduct);

    if (result.acknowledged) {
      res
        .status(201)
        .json({ message: "Product has been created successfully" });
    } else {
      res.status(500).json({ message: "Failed to create product" });
    }
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

productRouter.put("/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const { name, price, image, description, category } = req.body;

    // Validate required fields
    if (!name || !price || !image || !description || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create updated product object
    const updatedProduct = {
      name,
      price: Number(price),
      image,
      description,
      category,
    };

    // Update product in the database
    const result = await db
      .collection("products")
      .updateOne({ _id: new ObjectId(productId) }, { $set: updatedProduct });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (result.modifiedCount === 1) {
      res.json({ message: "Product updated successfully" });
    } else {
      res.status(500).json({ message: "Failed to update product" });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

productRouter.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    const result = await db
      .collection("products")
      .deleteOne({ _id: new ObjectId(productId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

productRouter.get("/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;

    // Check if the productId is a valid ObjectId
    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const product = await db.collection("products").findOne({
      _id: new ObjectId(productId),
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ data: product });
  } catch (error) {
    console.error("Error fetching product:", error);
    if (error instanceof BSONError) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});
productRouter.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;

    // Fetch products filtered by category
    const products = await db
      .collection("products")
      .find({ category: category })
      .toArray();

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: `No products found in ${category} category` });
    }

    res.json({ data: products });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
productRouter.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch products with pagination
    const products = await db
      .collection("products")
      .find()
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get the total count of products
    const totalCount = await db.collection("products").countDocuments();

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.json({
      data: products,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
productRouter.get("/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;

    // Check if the productId is a valid ObjectId
    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const product = await db.collection("products").findOne({
      _id: new ObjectId(productId),
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ data: product });
  } catch (error) {
    console.error("Error fetching product:", error);
    if (error instanceof BSONError) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});
productRouter.post("/", async (req, res) => {
  try {
    const { name, price, image, description, category } = req.body;

    // Validate required fields
    if (!name || !price || !image || !description || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate price
    if (isNaN(price) || price <= 0) {
      return res
        .status(400)
        .json({ message: "Price must be a positive number" });
    }

    // Create new product object
    const newProduct = {
      name,
      price: Number(price),
      image,
      description,
      category,
    };

    // Insert the new product into the database
    const result = await db.collection("products").insertOne(newProduct);

    if (result.acknowledged) {
      res
        .status(201)
        .json({ message: "Product has been created successfully" });
    } else {
      res.status(500).json({ message: "Failed to create product" });
    }
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
productRouter.put("/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const { name, price, image, description, category } = req.body;

    // Validate required fields
    if (!name || !price || !image || !description || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate price
    if (isNaN(price) || price <= 0) {
      return res
        .status(400)
        .json({ message: "Price must be a positive number" });
    }

    // Create updated product object
    const updatedProduct = {
      name,
      price: Number(price),
      image,
      description,
      category,
    };

    // Update product in the database
    const result = await db
      .collection("products")
      .updateOne({ _id: new ObjectId(productId) }, { $set: updatedProduct });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (result.modifiedCount === 1) {
      res.json({ message: "Product updated successfully" });
    } else {
      res.status(500).json({ message: "Failed to update product" });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
productRouter.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    const result = await db
      .collection("products")
      .deleteOne({ _id: new ObjectId(productId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default productRouter;
