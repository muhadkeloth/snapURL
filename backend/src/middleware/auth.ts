import { NextFunction, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { AppError } from "./errorHandler";
import User from "../models/User";
import UserRepository from "../repositories/userRepository";
import UserService from "../services/UserService";
import { AuthenticatedRequest } from "../utils/interface";
import logger from "../utils/logger";


const userService = new UserService(new UserRepository(User));


export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return next(new AppError("Access Denied",403));

    try {
        const verified = verifyToken(token);
        if(!verified || typeof verified !== 'object'){
            return next(new AppError("Invalid token payload",403));
        }
        let { userId } = verified as { userId: string; };
        const user = await userService.findOne({_id:userId});
        if (!user) {
            return next(new AppError("Access Denied: User inactive or not found", 403));
        }
        req.userId = user._id as string;
        
        logger.info(`req.user: ${req.userId}`)
        next();        
    } catch (error) {
        return next(new AppError("Invalid Token",403));        
    }
}