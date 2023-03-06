import { AppError } from "../../../../errors/appError";
import { prisma } from "../../../../config/prismaClient";
import { GetDTO } from "../../types/get";
require("dotenv").config();

export class GetAllUseCase {
  async execute({ idUser }: GetDTO) {

    if(!idUser) throw new AppError("No authorization", 401);

    try {
      const chats = await prisma.chat.findMany({ 
        where: { users: { none: { id: idUser } } },
        select: { id: true, users: true, messages: true, isGroup: true, name: true, imageUrl: true }
      })

      return await Promise.all(chats.map(async(chat) => {
        const messages = await prisma.chatMessage.findMany({
          where: { idChat: chat.id },
          orderBy: { createdAt: 'desc' },
          select: { 
            message: true, 
            isReadBy: true, 
            createdAt: true, 
            id: true, 
            senderId: true,
            isReceivedBy: true
          },
          take: 20
        })

        const notRead = messages.filter((message) => !message.isReadBy.includes(idUser)).length

        return {
          idChat: chat.id,
          name: chat.name,
          icon: chat.imageUrl,
          messages: messages,
          notRead: notRead,
          isGroup: chat.isGroup,
          isOnline: !chat.isGroup ? chat.users.find((user) => user.id != idUser) : null
        }

      }))
    } 
    catch (error) {
      throw new AppError("No chat found", 400);
    }
  }
}
