import { Router } from 'express'
import { login, signup, logout } from "../controllers/user.controller"


const router: Router = Router()

router.route("/signup").post(signup)
router.route("/login").post(login)
router.route("/logout").get(logout)

export default router