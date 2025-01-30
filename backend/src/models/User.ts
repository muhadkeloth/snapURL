import mongoose, { Schema } from "mongoose";
import { IUser } from "../utils/interface";


const UserSchema:Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
});

const User = mongoose.model<IUser>("User", UserSchema); 
export default User;