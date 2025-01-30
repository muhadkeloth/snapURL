import { hashPassword } from "../utils/functions";
import UserRepository from "../repositories/userRepository";



export default class UserService {
    private repository: UserRepository;

    constructor(repository: UserRepository) {
        this.repository = repository;
    }

    findOne = async (filter: any) => {
        return await this.repository.findOne(filter);
    }

     async create({name, email, password}:{name:string;email:string;password:string} ):Promise<any | null>{
        const hashedPassword = await hashPassword(password);
        return await this.repository.create({name, email, password:hashedPassword});
    }
         

}