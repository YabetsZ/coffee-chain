import { Request, Response, NextFunction } from "express";
import { ProductSchema } from "../schemas/zodSchemas/productSchema";
import logger from "../utils/logger";

export const validateProduct = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const result = ProductSchema.safeParse(req.body);
    if (!result.success) {
        logger.error(
            `The validation for product failed with error message: ${result.error.message}`
        );
        res.status(400).json({ error: result.error.flatten() });
        return;
    }
    req.body = result.data;
    next();
};
