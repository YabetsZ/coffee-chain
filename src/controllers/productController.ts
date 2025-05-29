import { NextFunction, Request, Response } from "express";
import { CoffeeProduct, JourneyStage, Product } from "../models/Product";
import {
    addNewChain,
    BlockchainService,
    entireBlockChain,
} from "../services/blockchainService";
import logger from "../utils/logger";
import {
    addStageToProductSchema,
    getProductChainSchema,
} from "../schemas/zodSchemas/productSchema";
import { AppError } from "../middlewares/errorMiddleware";
import { getProductChainService } from "../services/productService";

export const addProduct = async (req: Request, res: Response) => {
    const product: Product = {
        ...req.body,
    };
    const chainStart = await addNewChain(product);
    logger.info(
        `New chain created for a product ${chainStart.id} with chainId (${chainStart.chainId})`
    );
    res.status(201).json({ ...chainStart });
};

export const addStageToProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const { chainId } = req.params;
        const service = entireBlockChain[chainId];
        if (!service) {
            logger.warn(
                `Trying to access a chain with non-existing chain Id: ${chainId}`
            );
            throw new AppError("Chain not found", 404);
        }

        const validationResult = addStageToProductSchema.safeParse(req.body);
        if (!validationResult.success)
            throw new AppError(
                `validating for adding stages to a product failed, error: ${validationResult.error.message}`,
                400
            );
        const { newStage: stage, parent } = validationResult.data; // parent refers to the place(index for now) of it's parent
        const result = await service.addBlock(stage, parent);
        logger.info(
            `Adding a stage to the product with chain Id ${chainId} is completed!`
        );
        res.status(201).json({ ...result });
    } catch (err: any) {
        logger.error(`Error: ${err.message}`);
        next(err);
    }
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

export const getProductChain = (
    req: Request,
    res: Response,
    next: NextFunction
): any => {
    try {
        const valid = getProductChainSchema.safeParse(req.params);
        if (!valid.success)
            throw new AppError(
                `Failed to validate request: ${valid.error.message}`,
                400
            );
        const { chainId, id } = valid.data;
        const result = getProductChainService(chainId, id);
        if (!result.success) throw new AppError(result.message!, result.status);
        res.json({
            success: true,
            product: result.product,
            journey: result.journeys,
        });
    } catch (err) {
        logger.error(`Failed to get product's chain.`);
        next(err);
    }
};
