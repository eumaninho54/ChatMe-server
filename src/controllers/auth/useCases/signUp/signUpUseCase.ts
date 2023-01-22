import crypto from "crypto-js";
import { SignUpDTO } from "../../types/signUp";
import { AppError } from "../../../../errors/appError";
import { prisma } from "../../../../config/prismaClient";
import joi from "joi";
import * as jwt from "jsonwebtoken";
require("dotenv").config();


export class SignUpUseCase {
  async execute({ email, password }: SignUpDTO) {
    const validation = joi.object({
      email: joi.string().email().trim(true).required(),
      password: joi.string().min(8).trim(true).required()
    })

    if('error' in validation.validate({ email, password })){
      throw new AppError("Invalid data", 400);
    }

    if(await prisma.user.findFirst({ where: { email }})){
      throw new AppError('Email already used', 400);
    }
      
    try {
      const hashPassword = crypto.HmacSHA1(password, "password").toString()
      let name = email.split('@')[0].split('.')[0]
      let idName = ''

      loop: while (true) {
        for (let i = 1; i <= 9999; i++) {
          idName = ("0000" + i).slice(-4)

          if(!await prisma.user.findFirst({ where: {name: name + '#' + idName}}))
            break loop
          
          idName = ("0000" + i).slice(-4)
        }

        name = email.split('@')[0].split('.')[0] + Math.floor(Math.random() * 9)
      }

      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashPassword,
          name: name + '#' + idName
        }
      })

      const token = jwt.sign({ id: newUser.id }, process.env.SECRET, {});

      return { 
        username: newUser.name,
        email: newUser.email,
        auth: true,
        token: token
      }
    } catch (err) {
      throw new AppError('Server error', 500);
    }
  }
}

