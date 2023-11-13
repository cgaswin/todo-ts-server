import User from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../errors/ApiError";
import cookieToken from "../utils/cookieToken";
import { Request, Response, NextFunction } from "express";
import { userSchema,loginUserSchema } from "../schemas/userSchema";
import {MongooseUserType} from "../utils/types";

export const signup = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const parsedInput = userSchema.safeParse(req.body);
		if (!parsedInput.success) {
			return next(new ApiError(400, parsedInput.error.message));
		}
		const { name, email, password } = parsedInput.data;
		const user = await User.create({ name, email, password });
		cookieToken(user, res);
	}
);


export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => { 
    const parsedInput = loginUserSchema.safeParse(req.body);
    if (!parsedInput.success) {
        return next(new ApiError(400, parsedInput.error.message));
    }
    const { email, password } = parsedInput.data;
    const user: MongooseUserType = await User.findOne({ email }).select(
			"+password"
		);
    if (!user) {
        return next(new ApiError(401, "Invalid credentials"));
    }
    
    //confirm password
    const isPasswordCorrect: boolean = await user.validatePassword(password);
    
    if(!isPasswordCorrect){
        return next(new ApiError(401, "Invalid credentials"));
    }

    cookieToken(user, res);
})


export const logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => { 
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
})