import { prisma } from "../../../../config/prismaClient";
import { AppError } from "../../../../errors/appError";
import { IAuthUser } from "../../types/authUser";
import crypto from "crypto-js";
import * as jwt from "jsonwebtoken";
require("dotenv").config();


export class AuthUserUseCase {
  async execute({ refreshToken }: IAuthUser) {
    try {
      if(!refreshToken) throw 400

      const user = await prisma.user.findFirstOrThrow({ where: { refreshToken, expiresAt: { gte: new Date() } }})

      const accessToken = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: '1h' });
      const newRefreshToken = crypto.HmacSHA1(accessToken, process.env.SECRET).toString()
      let expiresAt = new Date()
      expiresAt.setDate(new Date().getDate() + 7)

      await prisma.user.update({ where: { id: user.id }, data: { refreshToken: newRefreshToken, expiresAt }})

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        auth: true,
        refreshToken: newRefreshToken,
        accessToken: accessToken
      }
    } 
    catch (error) {
      throw new AppError("Invalid authentication", 401);
    }
  }
}

