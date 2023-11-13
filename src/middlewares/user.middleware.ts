import User from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/ApiError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { userType } from "../utils/types";

interface RequestWithUser extends Request {
	user: userType;
}




export const isLoggedIn = asyncHandler(
	async (req: RequestWithUser, res: Response, next: NextFunction) => {
		let token: string | undefined = req
			.header("Authorization")
			?.replace("Bearer ", "");
		if (!token) {
			return next(new ApiError(401, "Please login to continue"));
		}

		try {
			const JWT_SECRET: string | undefined = process.env.JWT_SECRET;
			if (!JWT_SECRET) {
				return next(new ApiError(500, "Internal Server Error"));
			}
			const decoded: JwtPayload | undefined = jwt.verify(
				token,
				JWT_SECRET
			) as JwtPayload;

			if (!decoded || !decoded.id) {
				return next(new ApiError(401, "Invalid token"));
			}

			const user = await User.findById(decoded.id);

			if (!user) {
				return next(new ApiError(404, "User not found"));
			}

			req.user = user;

			next();
		} catch (err) {
			console.log(err);
			return next(new ApiError(401, "Invalid token"));
		}
	}
);
