import { Application, Request, Response } from "express";
import { MockBlockchain } from "../blockchain/MockBlockchain";
import { CoffeeProduct } from "../blockchain/models/CoffeeProduct";
import { JourneyStage } from "../blockchain/models/JourneyStage";
import { v4 as uuidv4 } from "uuid";

const blockchain = new MockBlockchain();

export const getAllProducts = (req: Request, res: Response) => {
    const products = blockchain.getAllProducts(); // getAllProductsService();
    res.json(products);
};

export const getProductById = (req: Request, res: Response): any => {
    // FIXME: here the return type shouldn't be any
    const id = req.params.id;

    const product = blockchain.getProductById(id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
};

export const addProduct = (req: Request, res: Response) => {
    const product: CoffeeProduct = {
        ...req.body,
        id: uuidv4(),
    };

    const record = blockchain.addProduct(product);
    res.status(201).json(record);
};

export const addStageToProduct = (req: Request, res: Response): any => {
    const { id } = req.params;
    const stage: JourneyStage = req.body;

    const updated = blockchain.addStage(id, stage);
    if (!updated) {
        return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updated);
};
