import logger from "../utils/logger";
import {
    getAllProductsInChainService,
    getProductByIdService,
} from "./productService";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import { QrCodeRecord } from "../models/QrCodeRecord";
import { addQrCode, checkQrCode, checkQrCodeById } from "../database/qrCodes";

export const generateQrCodeService = async (
    chainId: string,
    id: number
): Promise<QrCodeRecord> => {
    logger.info(
        `Generating QR code for Block with ID: ${id} which is found in chain ${chainId}.`
    );

    // Generate unique identifier for this QR code
    const qrId = uuidv4();

    // Create QR data (JSON object containing product and QR information)
    const qrData = JSON.stringify({
        qrId,
        id,
        chainId,
        timestamp: new Date().toISOString(),
    });

    // Generate QR code image (base64)
    const qrImage = await QRCode.toDataURL(qrData);

    // Create QR code record
    const qrCodeRecord: QrCodeRecord = {
        qrId,
        id,
        chainId,
        qrData,
        imageUrl: qrImage,
        createdAt: new Date(),
    };

    // Store QR code
    addQrCode(qrCodeRecord);

    return qrCodeRecord;
};

export const verifyQrCodeService = (qrId: string) => {
    logger.info("Verifying QR code");

    try {
        // Check if QR code exists in our records
        const qrCode = checkQrCodeById(qrId);
        if (!qrCode) {
            return { valid: false };
        }

        // Get product information
        const product = getAllProductsInChainService(qrCode.chainId);
        if (!product) {
            return { valid: false };
        }

        return {
            valid: true,
            product,
        };
    } catch (error) {
        logger.error("Error verifying QR code:", error);
        return { valid: false };
    }
};
