import { Product } from "../models/Product";

const products: Product[] = [
    {
        id: 1,
        name: "Arabica Premium",
        description: "High-altitude Colombian Arabica with floral notes.",
        origin: "Colombia",
        altitude: 2200,
        bean_type: "Arabica",
        harvest_year: 2024,
        hash_tags: ["smooth", "floral", "single-origin"],
        coffee_journey: [
            {
                stage_name: "Farming",
                details: {
                    company: "Green Mountain Farms",
                    location: "Medellín, Colombia",
                    completed_on: "2024-03-15",
                    status: "completed",
                    price_after_stage: 5.5,
                    additional_info: {
                        varietals: "Heirloom Ethiopian varieties",
                    },
                },
            },
            {
                stage_name: "Harvesting",
                details: {
                    company: "Sun Valley Co.",
                    location: "Medellín, Colombia",
                    completed_on: "2024-04-01",
                    status: "completed",
                    price_after_stage: 6.0,
                    additional_info: { date: Date.now() },
                },
            },
        ],
    },
];

// Business logic to get all products
export const getAllProductsService = (): Product[] => {
    return products;
};

// Get a single product using an id
export const getProductByIdService = (id: number): Product | undefined => {
    return products.find((product) => product.id === id);
};
// TODO: // (Later add more service functions: getProductById, createProduct, etc.)
