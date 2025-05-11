export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role:
        | "admin"
        | "farmer"
        | "processor"
        | "distributor"
        | "retailer"
        | "consumer";
    organization?: string;
    createdAt: Date;
    updatedAt?: Date;
}
