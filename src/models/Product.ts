import { CoffeeJourneyStage } from "./SupplyChainEvent";

export interface Product {
    id: number;
    name: string;
    description: string;
    origin: string;
    altitude: number;
    bean_type: string;
    harvest_year: number;
    hash_tags: string[];
    coffee_journey: CoffeeJourneyStage[];
}
