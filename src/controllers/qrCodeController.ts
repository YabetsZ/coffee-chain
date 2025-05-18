import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";
import {
    generateQrCodeService,
    verifyQrCodeService,
} from "../services/qrCodeService";
import { getBlockSchema } from "../schemas/zodSchemas/blockchainSchema";
import { AppError } from "../middlewares/errorMiddleware";
import { verifyQrSchema } from "../schemas/zodSchemas/qrCodeSchema";

export const verifyQrCode = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = verifyQrSchema.safeParse(req.body);
        if (!result.success) throw new AppError("Bad inputs.", 400);
        const { qrCodeId } = result.data;

        // Verify the QR code
        const verificationResult = verifyQrCodeService(qrCodeId);

        if (!verificationResult.valid) {
            return next(new AppError("Invalid QR code", 400));
        }

        res.json({
            success: true,
            data: verificationResult,
        });
    } catch (error) {
        logger.error("Error verifying QR code:", error);
        next(error);
    }
};
