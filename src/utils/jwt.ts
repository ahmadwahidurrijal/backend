import { Types } from "mongoose";
import { User } from "../models/user.model";
import jwt  from "jsonwebtoken";
import { SECRET } from "./env";

export interface IUserToken extends Omit<User, 'password'|'activationCode'|'isActive'|'email'|'fullName'|'profilePicture'|'username'> {
    id?: Types.ObjectId
}

export const generateToken = (User: IUserToken): string => {
    const token = jwt.sign(User, SECRET, {expiresIn: '1h'})
    return token
}
export const getUserData = (token:string): IUserToken =>{
    const user = jwt.verify(token, SECRET) as IUserToken
    return user
}