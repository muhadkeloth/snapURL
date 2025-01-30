import User from "../models/User";



export default class UserRepository {
    private model: typeof User;

    constructor(userModel: typeof User) {
        this.model = userModel;
    };

    async findOne(filter: any):Promise<any | null>{
        return await this.model.findOne(filter)
    }

    async create({name, email, password}:{name:string;email:string;password:string}):Promise<any | null>{
        const newUser = new User({name, email, password});
        return await newUser.save();  
    }

}