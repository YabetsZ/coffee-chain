import { Application, Request, Response } from "express";
import {
    getAllProductsService,
    getProductByIdService,
} from "../services/productService";

export const getAllProducts = (req: Request, res: Response) => {
    const products = getAllProductsService();
    res.json(products);
};

export const getProductById = (req: Request, res: Response): any => {
    // FIXME: here the return type shouldn't be any
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = getProductByIdService(id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
};
