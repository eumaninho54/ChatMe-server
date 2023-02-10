import { Router } from "express";
import { verifyTokenController } from "../modules/auth/useCases/verifyToken";
import { searchController } from "../modules/friends/useCases/search";


export const friendsRoutes = Router()

friendsRoutes.get("/search", 
  (res, req, next) => verifyTokenController.handle(res, req, next),
  (res, req, next) => searchController.handle(res, req))
