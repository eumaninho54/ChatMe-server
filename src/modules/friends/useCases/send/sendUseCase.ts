import crypto from "crypto-js";
import { SendDTO } from "../../types/send";
import { AppError } from "../../../../errors/appError";
import { prisma } from "../../../../config/prismaClient";
import joi from "joi";
import * as jwt from "jsonwebtoken";
require("dotenv").config();

export class SendUseCase {
  async execute({ isAdded, idUser, idFriend, accessToken, refreshToken }: SendDTO) {
    try {
      if(isAdded){
        await prisma.friendshipRequest.deleteMany({
          where: { senderId: idUser, receiverId: idFriend }
        })
      }
      else {
        await prisma.friendshipRequest.create({
          data: { senderId: idUser, receiverId: idFriend, isAccepted: false }
        })
      }

      return {
        accessToken,
        refreshToken
      }
    } 

    catch (err) {
      throw new AppError("User not found", 400);
    }
  }
}
