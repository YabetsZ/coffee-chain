// Is not being used right now

import { CoffeeProduct, JourneyStage, Product } from "../models/Product";
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

export const getProductChainService = (
    chainId: string,
    id: number
): {
    success: boolean;
    product?: CoffeeProduct;
    journeys?: JourneyStage[];
    message?: string;
    status?: number;
} => {
    const chain = entireBlockChain[chainId].getChain();
    const journeys: JourneyStage[] = [];

    let ptr: number | null = id;
    while (ptr !== null) {
        journeys.push(chain[ptr].journey);
        ptr = chain[ptr].p_index;
    }

    return {
        success: true,
        product: chain[id].product,
        journeys,
    };
};
