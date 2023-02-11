import { Request, Response } from "express";
import { SearchDTO } from "../../types/search";
import { SearchUseCase } from "./searchUseCase";

export class SearchController {
  constructor(private searchUseCase: SearchUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { idUser, refreshToken, accessToken } = req.params
    const username = req.query.q

    const result = await this.searchUseCase.execute({ 
      username: username as string, 
      idUser, 
      accessToken,
      refreshToken
    });

    return res.status(201).json(result);
  }
}
