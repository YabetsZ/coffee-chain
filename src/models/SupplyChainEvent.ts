export interface CoffeeJourneyStage {
    stage_name:
        | "Farming"
        | "Harvesting"
        | "Processing"
        | "Drying"
        | "Grinding"
        | "Roasting"
        | "Packaging"
        | "Distribution"
        | "Retail"; // Only allowed stages

    details: {
        company: string;
        location: string;
        completed_on: string; // ISO date string (e.g., "2025-04-28")
        status: "pending" | "completed"; // status of this stage
        price_after_stage: number; // price of the product after this stage
        additional_info?: Record<string, string | number>; // optional field { [key: string]: string | number }
    };
}
