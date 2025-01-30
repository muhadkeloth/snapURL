import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";


export const logRoute = (req: Request, res: Response, next: NextFunction) => {
    const { method, originalUrl } = req;
    const timestamp = new Date().toISOString();
    
    logger.info(`[${timestamp}] ${method} ${originalUrl}`);
    
    next(); 
  };