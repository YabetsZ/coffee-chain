import { Request, Response } from "express";
import { CoffeeProduct, JourneyStage, Product } from "../models/Product";
import {
    addNewChain,
    BlockchainService,
    entireBlockChain,
} from "../services/blockchainService";
import { v4 as uuidv4 } from "uuid";
import logger from "../utils/logger";

export const addProduct = (req: Request, res: Response) => {
    const product: Product = {
        ...req.body,
    };
    const chainId = addNewChain(product);
    logger.info(
        `New chain created for product ${product.product.id} with chainId (${chainId})`
    );
    res.status(201).json({ chainId, product });
};

export const addStageToProduct = (req: Request, res: Response): any => {
    const { chainId } = req.params;
    const stage: JourneyStage = req.body;
    const service = entireBlockChain[chainId];
    if (!service) {
        logger.warn(
            `Trying to access a chain with non-existing chain Id: ${chainId}`
        );
        return res.status(404).json({ message: "Chain not found" });
    }
    const result = service.addBlock(stage);
    logger.info(
        `Adding a stage to the product with chain Id ${chainId} is completed!`
    );
    res.status(201).json(result);
};

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

export const getProductById = (req: Request, res: Response): any => {
    const { chainId, id } = req.params;
    if (isNaN(Number(id))) {
        return res.status(400).json({ error: "Bad usage of parameters" });
    }
    const service = entireBlockChain[chainId];
    if (!service) {
        logger.warn(
            `Trying to access a chain with non-existing chain Id: ${chainId}`
        );
        return res.status(404).json({ message: "Chain not found" });
    }
    const block = service.getBlockById(Number(id));
    if (!block) {
        logger.warn(
            `Trying to access a product with non-existing product block Id: ${id}`
        );
        return res.status(404).json({ message: "Product not found" });
    }
    logger.info(
        `Product with chain Id: ${chainId} and product block Id: ${id} provided.`
    );
    res.json({ product: block.product, journey: block.journey });
};
