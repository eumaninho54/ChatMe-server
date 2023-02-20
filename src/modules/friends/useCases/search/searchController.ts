import { Request, Response } from "express";
import { SearchUseCase } from "./searchUseCase";

export class SearchController {
  constructor(private searchUseCase: SearchUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { q, idUser } = req.query

    const result = await this.searchUseCase.execute({ 
      username: q as string, 
      idUser: idUser as string
    });

    return res.status(201).json(result);
  }
}
