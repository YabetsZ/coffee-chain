export interface CoffeeProduct {
    id: string;
    parent_id?: string;
    name: string;
    description: string;
    origin: string;
    altitude: number;
    bean_type: string;
    harvest_year: number;
    hash_tags: string[];
}
