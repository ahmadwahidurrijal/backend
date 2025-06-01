import { Request, Response } from 'express';
import * as Yup from 'yup';
import UserModel from '../models/user.model';
import { encrypt } from '../utils/encryption';
import { generateToken } from '../utils/jwt';

type Tregister ={
    fullName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

type Tlogin ={
    identifier: string;
    password: string;
}


const registerValidateSchema = Yup.object({
    fullName: Yup.string()
        .required('Fullname is required'),
    username: Yup.string()
        .required('Username is required'),
    email: Yup.string()
        .required('Email is required')
        .email('Email is not valid'),
    password: Yup.string()
        .required('Password is required'),
    confirmPassword: Yup.string()
        .required('Confirm Password is required')
        

});

export default {

    async register(req:Request, res:Response){
        const {
            fullName,
            username,
            email,
            password,
            confirmPassword
        } = req.body as unknown as Tregister;

        try {
            await registerValidateSchema.validate({
            fullName,
            username,
            email,
            password,
            confirmPassword
        });
        const result = await UserModel.create({
            fullName,
            username,
            email,
            password
        })

        res.status(200).json({
            message: 'User registered successfully',
            data: {
                result,
            }
        });
        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({
                message : err.message,
                data: null
            })
        }
        },
    async login(req:Request, res:Response){
        const {
            identifier,
            password
        } = req.body as unknown as Tlogin;
        try {
            //amibl data user berdasarkan identifier -> email dan username
            //validasi password 
            const userByIdentifier = await UserModel.findOne({
                $or: [
                    { email: identifier },
                    { username: identifier }
                ],
            })

            if (!userByIdentifier) {
                return res.status(403).json({
                    message: 'User not found',
                    data: null
                })
            }
            //validasi password
            const validatePassword: boolean = encrypt(password) === userByIdentifier.password;

            if (!validatePassword){
                return res.status(403).json({
                    message: 'Invalid password',
                    data: null
                })
            }

            const token = generateToken({
                id: userByIdentifier._id,
                role: userByIdentifier.role,
            })
            //jika validasi password benar, maka user bisa login
            res.status(200).json({
                message: 'Login Berhasil',
                data: token,
            })
        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({
                message : err.message,
                data: null
            })
        }
    }
    }
    