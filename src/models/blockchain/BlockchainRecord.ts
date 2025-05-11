export interface BlockchainBlock {
    index: number;
    product: CoffeeProduct;
    journey: JourneyStage;
    hash: string;
    previous_hash?: string;
    created_at: string;
    updated_at: string;
}

export type UUID = string;

export type StageName =
    | "Farming"
    | "Harvesting"
    | "Processing"
    | "Drying"
    | "Grinding"
    | "Roasting"
    | "Packaging"
    | "Distribution"
    | "Retail";

export interface JourneyStage {
    stage: StageName;
    company: string;
    location: string;
    date_completed: string;
    price_after_stage: number;
    status: "Pending" | "Completed";
    details?: Record<string, string>;
}

export interface CoffeeProduct {
    id: string;
    name: string;
    description: string;
    origin: string;
    altitude: number;
    bean_type: string;
    harvest_year: number;
    hash_tags: string[];
}
