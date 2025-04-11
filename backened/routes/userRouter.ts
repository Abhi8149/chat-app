import { Router } from "express";
import { protect } from "../middleware/authmiddleware";
import { allUsers, login, register } from "../controllers/useController";

const userRouter=Router();

userRouter.route("/").get(protect,allUsers)
userRouter.route("/").post(register)
userRouter.route("/login").post(login)

export default userRouter