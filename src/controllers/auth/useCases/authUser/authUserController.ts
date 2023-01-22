import { NextFunction, Request, Response } from "express";
import { AuthUserUseCase } from "./authUserUseCase";

export class AuthUserController {
  constructor(private authUserUseCase: AuthUserUseCase) {}

  async handle(req: Request, res: Response) {
    const { token, id } = req.params

    const result = await this.authUserUseCase.execute({ token, id });

    return res.status(201).json(result);
  }
}
