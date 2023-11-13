import mongoose from 'mongoose';
import { TodoType } from '../schemas/todoSchema';
import { userType } from '../schemas/userSchema';

export interface MongooseTodoType extends mongoose.Document, Omit<TodoType, 'id'> {
    id: string;
}

interface IuserMethods {
	createJwtToken: () => Promise<string>;
	validatePassword: (userSendPassword: string) => Promise<boolean>;
	generateForgotPasswordToken: () => Promise<string>;
}

export interface MongooseUserType extends mongoose.Document, userType, IuserMethods {
	todos: string[]
}
export interface RequestWithUser extends Request {
	user: MongooseUserType;
}

export {userType}

export {TodoType}