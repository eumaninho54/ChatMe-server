import { NextFunction, Request, Response } from "express";
import { AuthUserUseCase } from "./authUserUseCase";

export class AuthUserController {
  constructor(private authUserUseCase: AuthUserUseCase) {}

  async handle(req: Request, res: Response) {
    const refreshToken = req.header("x-refresh-token")

    const result = await this.authUserUseCase.execute({ refreshToken });

    return res.status(201).json(result);
  }
}
