import { Router } from "express";
import { authUserController } from "../controllers/auth/useCases/authUser";
import { signInController } from "../controllers/auth/useCases/signIn";
import { signUpController } from "../controllers/auth/useCases/signUp";
import { verifyTokenController } from "../controllers/auth/useCases/verifyToken";


export const authRoutes = Router()

authRoutes.get("/", (res, req) => authUserController.handle(res, req))

authRoutes.post("/signIn", (res, req) => signInController.handle(res, req))

authRoutes.post("/signUp", (res, req) => signUpController.handle(res, req))

