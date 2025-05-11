import { User } from "../../models/User";
import "express";

declare module "express-serve-static-core" {
    interface Request {
        user?: User;
    }
}
