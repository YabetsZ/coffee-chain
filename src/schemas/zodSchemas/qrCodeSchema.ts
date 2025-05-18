import { z } from "zod";

export const verifyQrSchema = z.object({
    qrCodeId: z.string(),
});
