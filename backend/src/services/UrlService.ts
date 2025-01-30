import { IUrl } from "../utils/interface";
import UrlRepository from "../repositories/UrlRepository";


export type createUrl = {
    userId:string,
    originalUrl:string,
    shortUrl:string
}

export default class UrlService {
    private repository: UrlRepository;

    constructor(repository: UrlRepository) {
        this.repository = repository;
    }


    async create({userId, originalUrl, shortUrl}: createUrl):Promise<any | null>{
        return await this.repository.create({userId, originalUrl, shortUrl});
    }

    async findOne(filter: any):Promise<any | null>{
        return await this.repository.findOne(filter);
    }

    async findURLs(userId:string, skip:number, limit:number):Promise<any[] | null> {
        return await this.repository.findURLs(userId, skip, limit);
    };

    async findCountURLs(filter: any):Promise<number | null> {
        return await this.repository.findCountURLs(filter);
    }
    
    async findByShortUrl(shortUrl: string):Promise<IUrl | null> {
        return await this.repository.findByShortUrl(shortUrl);
    }
    
    async delete(filter: any):Promise<any | null> {
        try {
            return await this.repository.delete(filter);
        } catch (error) {
            return null            
        }
    }


}