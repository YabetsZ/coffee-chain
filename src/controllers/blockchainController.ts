import { Request, Response } from "express";
import {
    entireBlockChain,
    entireBlockChainSummary,
} from "../services/blockchainService";
import logger from "../utils/logger";
import { CoffeeProduct, JourneyStage } from "../models/Product";

export const getAllBlocks = (req: Request, res: Response): any => {
    logger.info(`The information of entire block chain have been provided.`);
    return res.json(entireBlockChainSummary());
};

// the same as its product counterpart !!!
export const getAllProductsInChain = (req: Request, res: Response): any => {
    interface allProducts {
        product: CoffeeProduct;
        journeys: JourneyStage[];
    }
    const { chainId } = req.params;
    const service = entireBlockChain[chainId];
    if (!service) {
        logger.warn(
            `Trying to access a chain with non-existing chain Id: ${chainId}`
        );
        return res.status(404).json({ message: "Chain not found" });
    }
    const chain = service.getChain();
    const products: allProducts = { product: chain[0].product, journeys: [] };
    chain.map((block) => products.journeys.push(block.journey));
    logger.info(
        `Access to chain product and journeys with chainId: ${chainId} is provided.`
    );
    res.json(products);
};

export const getBlockById = (req: Request, res: Response): any => {
    const { chainId, blockId } = req.params;
    if (isNaN(Number(blockId))) {
        return res.status(400).json({ error: "Bad usage of parameters" });
    }
    const chain = entireBlockChain[chainId];
    if (!chain) {
        logger.warn(
            `Trying to access a chain with non-existing chain Id: ${chainId}`
        );
        return res.status(404).json({ message: "Chain not found" });
    }
    const block = chain.getBlockById(Number(blockId));
    if (!block) {
        logger.warn(
            `Trying to access a block with non-existing block Id: ${blockId}`
        );
        return res.status(404).json({ message: "block not found" });
    }
    logger.info(
        `Block with chain Id: ${chainId} and block Id: ${blockId} provided.`
    );

    const { journey, product, ...needed } = block;

    res.json(needed);
};

export const verifyChain = (req: Request, res: Response): any => {
    const { chainId } = req.params;
    const chain = entireBlockChain[chainId];
    if (!chain) {
        logger.warn(
            `Trying to access a chain with non-existing chain Id: ${chainId}`
        );
        return res.status(404).json({ message: "Chain not found" });
    }
    const isValid = entireBlockChain[chainId].verifyIntegrity();
    logger.info(`Integrity of a chain with an Id: ${chainId} is checked.`);
    res.json({ valid: isValid });
};

// export const createBlock = (req: Request, res: Response) => {
//     const product = req.body;
//     const newBlock = blockchain.addBlock(product);
//     res.status(201).json(newBlock);
// };
