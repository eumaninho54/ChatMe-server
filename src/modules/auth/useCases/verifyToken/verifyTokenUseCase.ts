import { AppError } from "../../../../errors/appError";
import * as jwt from "jsonwebtoken";
import { JwtVerify, VerifyTokenDTO } from "../../types/verifyToken";
import { prisma } from "../../../../config/prismaClient";
import crypto from "crypto-js";
require("dotenv").config();

export class VerifyTokenUseCase {
  async execute({ refreshToken, accessToken }: VerifyTokenDTO) {
    let newRefreshToken = ''
    let newAccessToken = ''
    let hasError = false
    
    try {
      const idUser = (await prisma.user.findFirstOrThrow({where: { refreshToken: refreshToken, expiresAt: { gte: new Date() } }})).id

      jwt.verify(accessToken, process.env.SECRET, async (err, decoded: JwtVerify) => {
        if (err?.name  == 'TokenExpiredError'){
          newAccessToken = jwt.sign({ id: idUser }, process.env.SECRET, { expiresIn: '1h' });
          newRefreshToken = crypto.HmacSHA1(newAccessToken, process.env.SECRET).toString()

          let expiresAt = new Date()
          expiresAt.setDate(new Date().getDate() + 7)

          await prisma.user.update({where: { id: idUser }, data: { refreshToken: newRefreshToken, expiresAt } })
        }

        else if(err) hasError = true
    
        else {
          newAccessToken = accessToken
          newRefreshToken = refreshToken
        }
      })

      if(hasError) throw 401
  
      return {
        idUser,
        newAccessToken,
        newRefreshToken
      };
    }
    catch (err) {
      throw new AppError("Invalid authentication", 401);
    }
  }
}
