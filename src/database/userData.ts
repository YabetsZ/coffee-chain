import { User } from "../models/User";

export const users: User[] = [];

// Helper to add a user
export const addUser = async (user: User) => {
    users.push(user);
    return user;
};

export const findUserByUsername = (username: string) => {
    return users.find((u) => u.name === username);
};
