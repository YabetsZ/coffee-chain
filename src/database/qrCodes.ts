import { QrCodeRecord } from "../models/QrCodeRecord";

const qrCodes: QrCodeRecord[] = [];

export const addQrCode = (qrCode: QrCodeRecord) => {
    qrCodes.push(qrCode);
};

export const checkQrCode = (
    chainId: string,
    id: number
): QrCodeRecord | undefined => {
    return qrCodes.find((code) => code.chainId === chainId && code.id === id);
};

export const checkQrCodeById = (qrId: string): QrCodeRecord | undefined => {
    return qrCodes.find((code) => code.qrId === qrId);
};
