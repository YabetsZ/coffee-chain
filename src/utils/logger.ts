/**
 * - Usage example
 * logger.info(`New chain created for product ${product.name} (${product.id})`);
 * logger.warn(`Invalid block access attempt at chain ${chainId}`);
 * logger.error(`Integrity check failed for chain ${chainId}`);
 */

import winston from "winston";
import path from "path";
import fs from "fs";
// TODO: Later connect it with postgresql with custom transport
// Define log directory and filenames
// FIXME: for future it might be deleted but for now it's good
// deletes logs folder before usage
const folderPath = path.join(__dirname, "../../logs");
if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true, force: true });
    console.log(`Deleted: ${folderPath}`);
} else {
    console.log(`Folder not found: ${folderPath}`);
}

const logDir = "logs";
const logFile = path.join(logDir, "combined.log");
const errorFile = path.join(logDir, "error.log");

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
            ({ timestamp, level, message }) =>
                `[${timestamp}] ${level}: ${message}`
        )
    ),
    transports: [
        // Save all logs to combined.log
        new winston.transports.File({ filename: logFile }),
        // Save only errors to error.log
        new winston.transports.File({ filename: errorFile, level: "error" }),
    ],
});

if (process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    );
}

export default logger;
