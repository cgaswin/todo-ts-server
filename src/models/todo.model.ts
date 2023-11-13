import mongoose from "mongoose";
import { MongooseTodoType } from "../utils/types";


const todoModel = new mongoose.Schema({
    id: {
        type: String,
        required:true,
    },
    
    title: {
        type: String,
        required:[true, "Please provide a title"],
    },
    description: {
        type: String,
        required:[true, "Please provide a description"],
    },
    completed: {
        type: Boolean,
        default: false,
    },
},{timestamps:true})

const Todo = mongoose.model<MongooseTodoType>("Todo", todoModel);
export default Todo


