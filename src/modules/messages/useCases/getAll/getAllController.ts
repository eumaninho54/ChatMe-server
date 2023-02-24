import { Request, Response } from "express";
import { GetAllUseCase } from "./getAllUseCase";

export class GetAllController {
  constructor(private getAllUseCase: GetAllUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { idUser } = req.query;

    const result = await this.getAllUseCase.execute({ idUser: idUser as string });

    return res.status(201).json(result);
  }
}
