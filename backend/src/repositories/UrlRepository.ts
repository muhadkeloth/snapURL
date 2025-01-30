import { IUrl } from "../utils/interface";
import Url from "../models/Url";
import { createUrl } from "../services/UrlService";



export default class UrlRepository {
    private model: typeof Url;

    constructor(urlModel: typeof Url) {
        this.model = urlModel;
    };

    async create({userId, originalUrl, shortUrl}: createUrl):Promise<any | null>{
        const newUrl = new Url({userId, originalUrl, shortUrl});
        return await newUrl.save();  
    }

    async findOne(filter: any):Promise<any | null>{
        return await this.model.findOne(filter)
    }

    async findURLs(userId:string, skip:number, limit:number):Promise<any[] | null>{
        return await this.model.find({ userId: userId })
            .sort({ createdAt:-1 })
            .skip(skip)
            .limit(limit)
    }

    async findCountURLs(filter: any):Promise<number | null> {
        return await this.model.find(filter).countDocuments() || null ;
    }
    
    async findByShortUrl(shortUrl: string):Promise<IUrl | null> {
        return await this.model.findOne({shortUrl}) ;
    }
   
    async delete(filter: any):Promise<any | null> {
        return await this.model.deleteOne(filter) ;
    }

}