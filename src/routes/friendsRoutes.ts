import { Router } from "express";
import { verifyTokenController } from "../modules/auth/useCases/verifyToken";
import { searchController } from "../modules/friends/useCases/search";
import { sendController } from "../modules/friends/useCases/send";

export const friendsRoutes = Router();

friendsRoutes.get("/search", (res, req) => searchController.handle(res, req));

friendsRoutes.post(
  "/send",
  (res, req, next) => verifyTokenController.handle(res, req, next),
  (res, req, next) => sendController.handle(res, req));
