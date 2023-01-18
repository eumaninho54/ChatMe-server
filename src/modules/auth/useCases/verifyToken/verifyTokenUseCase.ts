import { AppError } from "../../../../errors/appError";
import * as jwt from "jsonwebtoken";
import { VerifyTokenDTO } from "../../types/verifyToken";
require("dotenv").config();


export class VerifyTokenUseCase {
  async execute({ token }: VerifyTokenDTO) {
    let id: string
    if (!token) throw new AppError('Invalid access', 400)

    try {
      jwt.verify(token, process.env.SECRET, (err, decoded: any) => {
        if(err) throw 401

        id = String(decoded.id)
      })
      
      return {
        id,
        token
      }
    } 
    catch (err) {
      throw new AppError('Invalid authentication', err)
    }
  }
}

