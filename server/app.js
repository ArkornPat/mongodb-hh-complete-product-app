import cors from "cors";
import express from "express";
import productRouter from "./apps/products.js";
import { connectToDatabase } from "./utils/db.js";

const app = express();
const port = 4001;

// Connect to MongoDB
connectToDatabase().then(() => {
  // Middleware and routes setup
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/products", productRouter);

  app.get("/", (req, res) => {
    // redacted
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(console.error);
