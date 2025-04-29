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
    details?: string;
}
