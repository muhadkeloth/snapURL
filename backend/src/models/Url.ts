import mongoose, { Schema } from "mongoose";
import { IUrl } from "../utils/interface";



const UrlSchema:Schema = new Schema<IUrl>({
    originalUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clicks: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Url = mongoose.model<IUrl>("Url", UrlSchema); 
export default Url;