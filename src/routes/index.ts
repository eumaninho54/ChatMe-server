import { Router } from "express";
import { authRoutes } from "./authRoutes"
import { friendsRoutes } from "./friendsRoutes";

const routes = Router()

routes.use("/auth", authRoutes)
routes.use("/friends", friendsRoutes)

export { routes }