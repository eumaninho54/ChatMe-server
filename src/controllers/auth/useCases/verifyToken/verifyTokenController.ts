import { NextFunction, Request, Response } from "express";
import { VerifyTokenDTO } from "../../types/verifyToken";
import { VerifyTokenUseCase } from "./verifyTokenUseCase";

export class VerifyTokenController {
  constructor(private verifyTokenUseCase: VerifyTokenUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    const token = req.header("x-access-token");

    const result = await this.verifyTokenUseCase.execute({ token });

    req.params.id = result.id;
    req.params.token = result.token;

    next()
  }
}
