import { Response } from 'express';
import { MongooseUserType } from './types';
import { ApiError } from '../errors/ApiError';



const cookieToken = async (user: MongooseUserType, res: Response) => {
	const token: string = await user.createJwtToken();
	const { email, name } = user;
	const userDetails = {
		email,
		name,
		user_id:user._id
	}
	let COOKIE_TIME: number | undefined = process.env.COOKIE_TIME ? parseInt(process.env.COOKIE_TIME) : undefined;
	if (!COOKIE_TIME) { 
		return new ApiError(500, "Internal Server Error");
	}
	const options = {
		expires: new Date(Date.now() + COOKIE_TIME * 24 * 60 * 60 * 1000),
		httpOnly: true,
	};

	res.status(200).cookie("token", token, options).json({
		success: true,
		data: userDetails,
	})
	
};

export default cookieToken;