import { Router } from "express";
import { authUserController } from "../modules/auth/useCases/authUser";
import { signInController } from "../modules/auth/useCases/signIn";
import { signUpController } from "../modules/auth/useCases/signUp";


export const authRoutes = Router()

authRoutes.get("/", (res, req) => authUserController.handle(res, req))

authRoutes.post("/signIn", (res, req) => signInController.handle(res, req))

authRoutes.post("/signUp", (res, req) => signUpController.handle(res, req))

