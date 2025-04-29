import { BlockchainCoffeeRecord } from "./models/BlockchainRecord";
import { CoffeeProduct } from "./models/CoffeeProduct";
import { JourneyStage } from "./models/JourneyStage";
import crypto from "crypto";

export class MockBlockchain {
    private chain: BlockchainCoffeeRecord[] = [];

    addProduct(product: CoffeeProduct): BlockchainCoffeeRecord {
        const newBlock: BlockchainCoffeeRecord = {
            product,
            journey: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            hash: this.generateHash(product),
            previous_hash: this.chain.length
                ? this.chain[this.chain.length - 1].hash
                : undefined,
        };

        this.chain.push(newBlock);
        return newBlock;
    }

    addStage(
        productId: string,
        stage: JourneyStage
    ): BlockchainCoffeeRecord | null {
        const record = this.chain.find((p) => p.product.id === productId);
        if (!record) return null;

        record.journey.push(stage);
        record.updated_at = new Date().toISOString();
        record.hash = this.generateHash(record); // simulate rehash
        return record;
    }

    getProductById(productId: string): BlockchainCoffeeRecord | null {
        return this.chain.find((p) => p.product.id === productId) || null;
    }

    getAllProducts(): BlockchainCoffeeRecord[] {
        return this.chain;
    }

    private generateHash(data: any): string {
        const str = JSON.stringify(data) + Date.now();
        return crypto.createHash("sha256").update(str).digest("hex");
    }
}
