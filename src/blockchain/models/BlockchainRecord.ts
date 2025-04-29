import { CoffeeProduct } from "./CoffeeProduct";
import { JourneyStage } from "./JourneyStage";

export interface BlockchainCoffeeRecord {
    product: CoffeeProduct;
    journey: JourneyStage[];
    created_at: string;
    updated_at: string;
    hash: string;
    previous_hash?: string;
}
