import mongoose from "mongoose";
import {userType,MongooseUserType } from "../utils/types";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userModel = new mongoose.Schema({
    name: {
        type: String,
        required:[true, "Please provide a name"],
    },
    email: {
        type: String,
        required:[true, "Please provide a email"],
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        select:false,
    },
    todos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo',
    }], 
    forgotPasswordToken: {
        type: String,
        default: null,
    },
    forgotPasswordExpiry: {
        type: Number,
        default: null,
    },
}, { timestamps: true })


//encrypt before save
userModel.pre<MongooseUserType>(
	"save",
	async function (next: (err?: Error) => void) {
		if (!this.isModified("password")) {
			return next();
        }
        this.password = await bcrypt.hash(this.password, 10)
	}
);

//validate the password with passed on user password
userModel.methods.validatePassword = async function (userSendPassword: string): Promise<boolean>{
    return await bcrypt.compare(userSendPassword,this.password)
}

//create a jwt token
userModel.methods.createJwtToken = async function (): Promise<string>{
    return  jwt.sign({ id: this._id }, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRY })
}

//generate forgot password token
userModel.methods.generateForgotPasswordToken = async function (): Promise<string> { 
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.forgotPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.forgotPasswordExpiry = Date.now() + 10 * (60 * 1000);
    return resetToken;
}


const User = mongoose.model<MongooseUserType>("User", userModel);
export default User
