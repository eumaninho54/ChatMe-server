import { prisma } from "../../../../config/prismaClient";
import { AppError } from "../../../../errors/appError";
import { IAuthUser } from "../../types/authUser";
import crypto from "crypto-js";
import * as jwt from "jsonwebtoken";
require("dotenv").config();


export class AuthUserUseCase {
  async execute({ refreshToken }: IAuthUser) {
    try {
      const user = await prisma.user.findFirstOrThrow({ where: { refreshToken }})

      const accessToken = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: '1h' });
      const newRefreshToken = crypto.HmacSHA1(accessToken, "password").toString()

      await prisma.user.update({ where: { id: user.id }, data: { refreshToken: newRefreshToken }})

      return {
        username: user.name,
        email: user.email,
        auth: true,
        refreshToken: newRefreshToken,
        accessToken: accessToken
      }
    } 
    catch (error) {
      throw new AppError("Invalid authentication", 400);
    }
  }
}

