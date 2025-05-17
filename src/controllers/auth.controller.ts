import { Request, Response } from 'express';
import * as Yup from 'yup';
import UserModel from '../models/user.model';

type Tregister ={
    fullName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const registerValidateSchema = Yup.object({
    fullName: Yup.string()
        .required('Fullname is required'),
    username: Yup.string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters long')
        .max(20, 'Username must be at most 20 characters long'),
    email: Yup.string()
        .required('Email is required')
        .email('Email is not valid'),
    password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .max(20, 'Password must be at most 20 characters long'),
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
        }
    }
    