export interface User {
    // id: string;
    name: string;
    username: string;
    email: string;
    password: string;
    role:
        | "admin"
        | "farmer"
        | "processor"
        | "distributor"
        | "retailer"
        | "consumer";
    organization: string;
    createdAt: string; // Date
    updatedAt?: string; // Date
}

export type userRoles =
    | "admin"
    | "farmer"
    | "processor"
    | "distributor"
    | "retailer"
    | "consumer";

// id, name, email, role, organization, createdAt, updatedAt
