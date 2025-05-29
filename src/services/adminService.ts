import { getAllUsers } from "../database/queries/userData";

export const getAllUsersService = async () => {
    try {
        return await getAllUsers();
    } catch (err) {
        throw err;
    }
};
