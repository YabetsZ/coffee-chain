import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorMiddleware";
import routes from "./routes";
import logger from "./utils/logger";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const openApiDocument = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./utils/documentation.json"), "utf-8")
);

app.use("/api/apiDoc", swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use(routes);
app.use(errorHandler);

export default app;

app.listen(5000, "0.0.0.0", (err) => {
    logger.info(`CoffeeChain API running on port ${PORT}`);
    logger.info(`http://localhost:${PORT}/api`);
});
