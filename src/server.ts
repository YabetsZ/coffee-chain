import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorMiddleware";
import routes from "./routes";
import logger from "./utils/logger";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(routes);
app.use(errorHandler);

export default app;

app.listen(5000, "0.0.0.0", (err) => {
    logger.info(`CoffeeChain API running on port ${PORT}`);
    logger.info(`http://localhost:${PORT}/api`);
});
