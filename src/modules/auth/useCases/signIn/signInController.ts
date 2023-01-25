import { Request, Response } from "express";
import { SignInDTO } from "../../types/signIn";
import { SignInUseCase } from "./signInUseCase";

export class SignInController {
  constructor(private signInUseCase: SignInUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { email, password }: SignInDTO = req.body;

    const result = await this.signInUseCase.execute({ email, password });

    return res.status(201).json(result);
  }
}
