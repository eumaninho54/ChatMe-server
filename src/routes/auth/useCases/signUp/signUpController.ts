import { Request, Response } from "express";
import { SignUpDTO } from "../../types/signUp";
import { SignUpUseCase } from "./signUpUseCase";

export class SignUpController {
  constructor(private signUpUseCase: SignUpUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { email, password }: SignUpDTO = req.body;

    const result = await this.signUpUseCase.execute({ email, password });

    return res.status(201).json(result);
  }
}
