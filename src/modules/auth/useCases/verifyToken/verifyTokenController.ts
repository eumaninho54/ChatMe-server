import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../../errors/appError";
import { VerifyTokenDTO } from "../../types/verifyToken";
import { VerifyTokenUseCase } from "./verifyTokenUseCase";

export class VerifyTokenController {
  constructor(private verifyTokenUseCase: VerifyTokenUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.header("x-access-token");
    const refreshToken = req.header("x-refresh-token");

    const result = await this.verifyTokenUseCase.execute({
      accessToken,
      refreshToken,
    });

    req.params.idUser = result.idUser;
    req.params.accessToken = result.newAccessToken;
    req.params.refreshToken = result.newRefreshToken;

    next();
  }
}
