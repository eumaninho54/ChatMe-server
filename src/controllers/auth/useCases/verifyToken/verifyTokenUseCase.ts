import { AppError } from "../../../../errors/appError";
import * as jwt from "jsonwebtoken";
import { JwtVerify, VerifyTokenDTO } from "../../types/verifyToken";
import { prisma } from "../../../../config/prismaClient";
require("dotenv").config();

export class VerifyTokenUseCase {
  async execute({ refreshToken, accessToken }: VerifyTokenDTO) {
    let newRefreshToken = ''
    let newAccessToken = ''
    let id = ''

    try {
      if(await prisma.user.findFirst({where: { refreshToken: refreshToken }})){
        jwt.verify(accessToken, process.env.SECRET, async (err, decoded: JwtVerify) => {
          if (err.name == 'TokenExpiredError'){
            newAccessToken = jwt.sign({ id: decoded.id }, process.env.SECRET, { expiresIn: '1h' });
            newRefreshToken = CryptoJS.HmacSHA1(newAccessToken, "password").toString()
  
            await prisma.user.update({where: { id: decoded.id }, data: { refreshToken: newRefreshToken } })
          }
          else if(err) throw 401
  
          newAccessToken = accessToken
          newRefreshToken = refreshToken
          id = String(decoded.id);
        });
  
        return {
          id,
          newAccessToken,
          newRefreshToken
        };
      }
      else throw 401

    } catch (err) {
      throw new AppError("Invalid authentication", err);
    }
  }
}
