// Is not being used right now

import { Product } from "../models/Product";
import { entireBlockChain } from "./blockchainService";

// Business logic to get all products
export const getAllProductsInChainService = (chainId: string): Product[] => {
    const products: Product[] = [];
    for (const product of entireBlockChain[chainId].getChain()) {
        let prepare: Product = {
            product: product["product"],
            journey: product["journey"],
        };
        products.push(prepare);
    }
    return products;
};

// Get a single product using an id
export const getProductByIdService = (
    chainId: string,
    id: number
): Product | undefined => {
    const chain = entireBlockChain[chainId].getChain();
    return chain.find((product) => product.index === id);
};
// TODO: // (Later add more service functions: getProductById, createProduct, etc.)
