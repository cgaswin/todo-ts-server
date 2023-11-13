import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { todoIdSchema, createTodoSchema } from "../schemas/todoSchema";
import { MongooseTodoType, RequestWithUser, TodoType } from "../utils/types";
import Todo from "../models/todo.model";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/ApiError";
import { userSchema,userIdSchema } from "../schemas/userSchema";
import User from "../models/user.model";

//Get all Todos
export const getAllTodos = asyncHandler(
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const todos: TodoType[] = await Todo.find();
		res.status(200).json({
			success: true,
			data: todos,
		});
	}
);

//Get a particular Todo
export const getSingleTodo = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const parsedInput = todoIdSchema.safeParse(req.params.id);
		if (!parsedInput.success) {
			return next(
				new ApiError(400, parsedInput.error?.message || "invalid id")
			);
		}

		const todo: TodoType | null = await Todo.findOne({ id: parsedInput.data });
		if (!todo) {
			return next(new ApiError(404, "Todo not found"));
		}
		res.status(200).json({
			success: true,
			data: todo,
		});
	}
);

//Add a todo
export const addTodo = asyncHandler(
	async (
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		const parsedInput = createTodoSchema.safeParse(req.body);
		if (!parsedInput.success) {
			return next(
				new ApiError(400, parsedInput.error?.message || "invalid input")
			);
		}
		const { title, description }: Omit<TodoType, "id" | "completed"> =
			parsedInput.data;
		const todo: TodoType = {
			id: uuidv4(),
			title,
			description,
			completed: false,
		};
		const newTodo = await Todo.create(todo);

		req.user.todos.push(newTodo._id);
		await req.user.save();

		res.status(201).json({
			success: true,
			data: newTodo,
		});
	}
);

//get Todo of a user
export const getTodoOfUser = asyncHandler(
	async (
		req: RequestWithUser,
		res: Response,
		next: NextFunction
    ): Promise<void> => {
        console.log(req.user._id)
        const parsedInput = userIdSchema.safeParse(req.user._id.toString());
        if (!parsedInput.success) { 
            return next(new ApiError(400, parsedInput.error?.message || "Invalid id"))
        }

        const userId = parsedInput.data;
		const user = await User.findById(userId).populate("todos");

		if (!user) {
			return next(new ApiError(404, "User not found"));
		}

		res.status(200).json({
			success: true,
			data: user?.todos,
		});
	}
);

//delete a particular todo
export const deleteTodo = asyncHandler(
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const parsedInput = todoIdSchema.safeParse(req.params.id);
		if (!parsedInput.success) {
			return next(
				new ApiError(400, parsedInput.error?.message || "Invalid id")
			);
		}
		const todo: TodoType | null = await Todo.findOneAndDelete({
			id: parsedInput.data,
		}); //returns null if todo not found
		if (!todo) {
			return next(new ApiError(404, "Todo not found"));
		}
		res.status(200).json({
			success: true,
			message: "Todo deleted successfully",
			data: todo,
		});
	}
);

//update a particular todo
export const updateTodo = asyncHandler(
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const parsedInput = todoIdSchema.safeParse(req.params.id);
		if (!parsedInput.success) {
			return next(
				new ApiError(400, parsedInput.error?.message || "invalid id")
			);
		}

		const todo: MongooseTodoType | null = await Todo.findOne({
			id: parsedInput.data,
		});
		if (!todo) {
			return next(new ApiError(404, "Todo not found"));
		}

		const { title, description, completed }: Omit<TodoType, "id"> = req.body;
		if (title) {
			todo.title = title;
		}
		if (description) {
			todo.description = description;
		}
		if (completed) {
			todo.completed = completed;
		}
		const updatedTodo = await todo.save({ validateBeforeSave: true });

		res.status(200).json({
			success: true,
			message: "Todo updated successfully",
			data: updatedTodo,
		});
	}
);
