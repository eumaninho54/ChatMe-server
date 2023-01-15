import { Router } from "express";
import { signUpController } from "./auth/useCases/signUp";

export const authRoutes = Router()


authRoutes.post("/signUp", (res, req) => signUpController.handle(res, req))
