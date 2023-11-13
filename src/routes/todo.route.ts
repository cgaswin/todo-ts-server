import { Router } from "express";
import {
	addTodo,
	deleteTodo,
	getAllTodos,
	getSingleTodo,
	updateTodo,
	getTodoOfUser,
} from "../controllers/todoController";
import { isLoggedIn } from "../middlewares/user.middleware";

const router: Router = Router();

router.route("/todos/").get(isLoggedIn, getAllTodos).post(isLoggedIn, addTodo);
router.route("/todos/user/").get(isLoggedIn, getTodoOfUser);
router
	.route("/todos/:id")
	.get(isLoggedIn, getSingleTodo)
	.delete(isLoggedIn, deleteTodo)
	.put(isLoggedIn, updateTodo);

export default router;
