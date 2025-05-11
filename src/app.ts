import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes";
import blockchainRoutes from "./routes/blockchainRoutes";
import { errorHandler } from "./middlewares/errorMiddleware";

let app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/blockchain", blockchainRoutes);
app.use(errorHandler);

export default app;
