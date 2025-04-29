import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes";

let app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);

export default app;
