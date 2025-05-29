export interface BlockchainBlock {
    index: number;
    p_index: number | null; // this is (stands for parent index :D) an addition to track all the process
    product: CoffeeProduct;
    journey: JourneyStage;
    hash: string;
    previous_hash?: string;
    created_at: string;
    updated_at: string;
    qrCode: {
        dataUrl: string; // Base64-encoded QR code image
        qrCodeId: string; // Optional identifier
    };
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
    details?: Record<string, string | number>;
}

export interface CoffeeProduct {
    // id: string;
    name: string;
    description: string;
    origin: string;
    altitude: number;
    bean_type: string;
    harvest_year: number;
    hash_tags: string[];
}
