import crypto from "crypto-js";
import { SignInDTO } from "../../types/signIn";
import { AppError } from "../../../../errors/appError";
import { prisma } from "../../../../config/prismaClient";
import joi from "joi";
import * as jwt from "jsonwebtoken";
require("dotenv").config();


export class SignInUseCase {
  async execute({ email, password }: SignInDTO) {
    const validation = joi.object({
      email: joi.string().trim(true).email().required(),
      password: joi.string().min(8).trim(true).required()
    })

    if('error' in validation.validate({ email, password })){
      throw new AppError("Invalid data", 400);
    }

    try {
      const hashPassword = crypto.HmacSHA1(password, "password").toString()

      const user = await prisma.user.findFirstOrThrow({ where: { password: hashPassword, email: email }})

      const token = jwt.sign({ id: user.id }, process.env.SECRET, {});

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

