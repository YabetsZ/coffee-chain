import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { CoffeeProduct, JourneyStage, Product } from "../models/Product";
import { BlockchainBlock } from "../models/blockchain/BlockchainRecord";

type UUID = string;

export const entireBlockChain: Record<UUID, BlockchainService> = {};

export const addNewChain = (firstProduct: Product) => {
    const chainId = uuidv4();
    const newChain = new BlockchainService(firstProduct);
    entireBlockChain[chainId] = newChain;
    return chainId;
};

export const entireBlockChainSummary = () => {
    interface Summary {
        chainId: string;
        product_discription: CoffeeProduct;
        total_blocks: number;
        created_at: string;
        updated_at: string;
    }
    const summary: Summary[] = [];
    Object.keys(entireBlockChain).map((key) => {
        const chain = entireBlockChain[key].getChain();
        summary.push({
            chainId: key,
            product_discription: chain[0].product,
            total_blocks: chain.length,
            created_at: chain[0].created_at,
            updated_at: chain[0].updated_at,
        });
    });

    return summary;
};

export class BlockchainService {
    private chain: BlockchainBlock[] = [];

    constructor(sack: Product) {
        this.createGenesisBlock(sack);
    }

    private createGenesisBlock(sack: Product) {
        const genesis: BlockchainBlock = {
            index: 0,
            product: sack.product,
            hash: "",
            journey: sack.journey,
            previous_hash: undefined,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        genesis.hash = this.generateHash(genesis);
        this.chain.push(genesis);
    }

    private generateHash(data: BlockchainBlock): string {
        const { hash, ...important } = data;
        const blockString = JSON.stringify(important);

        return crypto.createHash("sha256").update(blockString).digest("hex");
    }

    public addBlock(pack: JourneyStage) {
        const lastBlock = this.chain[this.chain.length - 1];
        const newBlock: BlockchainBlock = {
            index: this.chain.length,
            product: lastBlock.product,
            journey: pack,
            hash: "",
            previous_hash: lastBlock.hash,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        newBlock.hash = this.generateHash(newBlock);
        this.chain.push(newBlock);
        return {
            id: newBlock.index,
            product: newBlock.product,
            journey: pack,
        };
    }

    public getChain(): BlockchainBlock[] {
        return this.chain;
    }

    public getBlockById(index: number): BlockchainBlock | undefined {
        return this.chain.find((b) => b.index === index);
    }

    public verifyIntegrity(): boolean {
        for (let i = 1; i < this.chain.length; i++) {
            const current = this.chain[i];
            const previous = this.chain[i - 1];

            if (current.previous_hash !== previous.hash) return false;
            if (current.hash !== this.generateHash(current)) return false;
        }
        return true;
    }
}
