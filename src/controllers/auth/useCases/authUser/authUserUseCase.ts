import { prisma } from "../../../../config/prismaClient";
import { AppError } from "../../../../errors/appError";
import { IAuthUser } from "../../types/authUser";
require("dotenv").config();


export class AuthUserUseCase {
  async execute({ token, id }: IAuthUser) {
    try {
      const user = await prisma.user.findFirstOrThrow({ where: { id }})

      return {
        username: user.name,
        email: user.email,
        auth: true,
        token: token
      }
    } 
    catch (error) {
      throw new AppError("User not found", 400);
    }
  }
}

