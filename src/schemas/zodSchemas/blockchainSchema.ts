import { z } from "zod";

export const getBlockSchema = z.object({
    chainId: z.string(),
    id: z.number(),
});
