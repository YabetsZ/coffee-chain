import { z } from "zod";

export const StageNameEnum = z.enum([
    "Farming",
    "Harvesting",
    "Processing",
    "Drying",
    "Grinding",
    "Roasting",
    "Packaging",
    "Distribution",
    "Retail",
]);

export const JourneyStageSchema = z.object({
    stage: StageNameEnum,
    company: z.string(),
    location: z.string(),
    date_completed: z.string(),
    price_after_stage: z.number(),
    status: z.enum(["Pending", "Completed"]),
    details: z.record(z.string()).optional(),
});

export const CoffeeProductSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    origin: z.string(),
    altitude: z.number(),
    bean_type: z.string(),
    harvest_year: z.number(),
    hash_tags: z.array(z.string()),
});

export const ProductSchema = z.object({
    product: CoffeeProductSchema,
    journey: JourneyStageSchema,
});

export const addStageToProductSchema = z.object({
    newStage: JourneyStageSchema,
    parent: z.number(),
});

export const getProductChainSchema = z.object({
    chainId: z.string(),
    id: z.number(),
});
