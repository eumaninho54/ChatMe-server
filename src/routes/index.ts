import { Router } from "express";
import { authRoutes } from "./authRoutes"
import { friendsRoutes } from "./friendsRoutes";
import { messagesRoutes } from "./messagesRoutes";

const routes = Router()

routes.use("/auth", authRoutes)
routes.use("/friends", friendsRoutes)
routes.use("/messages", messagesRoutes)

export { routes }