import { Request, Response } from "express";
import { BodyDTO } from "../../types/send";
import { SendUseCase } from "./sendUseCase";

export class SendController {
  constructor(private sendUseCase: SendUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { isAdded, idFriend }: BodyDTO = req.body
    const { idUser, accessToken, refreshToken } = req.params

    const result = await this.sendUseCase.execute({ isAdded, idUser, idFriend, accessToken, refreshToken })

    return res.status(201).json(result)
  }
}
