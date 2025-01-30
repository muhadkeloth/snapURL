import { Request } from "express";
import { Document, Schema } from "mongoose";


export interface AuthenticatedRequest extends Request { userId?: string; }


export interface IUser extends Document {
    username:string;
    email:string;
    password:string;
    otp?: string;
    createdAt?:Date;
}

export interface IUrl extends Document {
    originalUrl: string;
    shortUrl: string;
    userId: Schema.Types.ObjectId;
    clicks: number;
    createdAt: Date;
};