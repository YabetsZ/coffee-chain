import { Request, Response, NextFunction } from "express";
import { JourneyStageSchema } from "../schemas/zodSchemas/productSchema";
import logger from "../utils/logger";

export const validateJourneyStage = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const result = JourneyStageSchema.safeParse(req.body);

    if (!result.success) {
        logger.error(
            `The validation for product failed with error message: ${result.error.issues}`
        );
        res.status(400).json({ error: result.error.flatten() });
        return;
    }

    req.body = result.data;
    next();
};
