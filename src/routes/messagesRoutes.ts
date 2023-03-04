import { Router } from "express";
import { getAllController } from "../modules/messages/useCases/getAll";

export const messagesRoutes = Router();

messagesRoutes.get("/", (res, req) => getAllController.handle(res, req));

