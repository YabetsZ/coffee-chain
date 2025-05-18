import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { CoffeeProduct, JourneyStage, Product } from "../models/Product";
import { BlockchainBlock } from "../models/blockchain/BlockchainRecord";
import { generateQrCodeService } from "./qrCodeService";

type UUID = string;

export const entireBlockChain: Record<UUID, BlockchainService> = {};

export const addNewChain = async (firstProduct: Product) => {
    const newChain = new BlockchainService();
    const response = await newChain.createGenesisBlock(firstProduct, uuidv4());
    entireBlockChain[newChain.chainId] = newChain;
    return response;
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
    private chain: BlockchainBlock[];
    chainId: string;

    constructor() {
        this.chain = [];
        this.chainId = uuidv4();
    }

    async createGenesisBlock(sack: Product, chainId: string) {
        const generatedQr = await generateQrCodeService(chainId, 0);
        const genesis: BlockchainBlock = {
            index: 0,
            p_index: null,
            product: sack.product,
            hash: "",
            journey: sack.journey,
            previous_hash: undefined,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            qrCode: {
                dataUrl: generatedQr.imageUrl,
                qrCodeId: generatedQr.qrId,
            },
        };
        genesis.hash = this.generateHash(genesis);
        this.chain.push(genesis);
        return {
            chainId: this.chainId,
            id: genesis.index,
            product: genesis.product,
            journey: genesis.journey,
            qrCode: genesis.qrCode,
        };
    }

    private generateHash(data: BlockchainBlock): string {
        const { hash, ...important } = data;
        // FIXME:use json-stable-stringify package for future
        const blockString = JSON.stringify(important);

        return crypto.createHash("sha256").update(blockString).digest("hex");
    }

    public async addBlock(pack: JourneyStage, p_index: number) {
        const lastBlock = this.chain[this.chain.length - 1];
        const generatedQr = await generateQrCodeService(
            this.chainId,
            this.chain.length
        );
        const newBlock: BlockchainBlock = {
            index: this.chain.length,
            p_index,
            product: lastBlock.product,
            journey: pack,
            hash: "",
            previous_hash: lastBlock.hash,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            qrCode: {
                dataUrl: generatedQr.imageUrl,
                qrCodeId: generatedQr.qrId,
            },
        };
        newBlock.hash = this.generateHash(newBlock);
        this.chain.push(newBlock);
        return {
            chainId: this.chainId,
            id: newBlock.index,
            product: newBlock.product,
            journey: pack,
            qrCode: newBlock.qrCode,
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
