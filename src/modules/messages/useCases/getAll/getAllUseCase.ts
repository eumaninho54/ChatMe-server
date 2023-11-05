import { AppError } from "../../../../errors/appError";
import { prisma } from "../../../../config/prismaClient";
import { GetDTO } from "../../types/get";
require("dotenv").config();

export class GetAllUseCase {
  async execute({ idUser }: GetDTO) {

    if(!idUser) throw new AppError("No authorization", 401);

    try {
      let chats = await prisma.chat.findMany({ 
        where: { users: { some: { id: idUser } } },
        select: { 
          id: true, 
          users: { 
            select: {
              id: true,
              name: true,
              email: true,
              imageUrl: true,
              isActive: true
            } 
          }, 
          messages: true, 
          isGroup: true, 
          name: true, 
          imageUrl: true 
        }
      })

    
      return await Promise.all(chats.map(async(chat) => {
        const messages = await prisma.chatMessage.findMany({
          where: { idChat: chat.id },
          orderBy: { createdAt: 'desc' },
          select: { 
            id: true,
            idChat: true,
            isReceivedBy: true,
            createdAt: true,
            isReadBy: true,
            message: true,
            sender: { 
              select: { 
                id: true,
                name: true,
                email: true,
                isActive: true,
              } 
            },
          },
          take: 20
        })

        messages.forEach(async(message) => {
          if(!message.isReceivedBy.includes(idUser)){
            await prisma.chatMessage.update({
              where: {
                id: message.id
              },
              data: { 
                isReceivedBy: { 
                  push: idUser 
                } 
              }
            })
          }
        })

        const notRead = messages.filter((message) => !message.isReadBy.includes(idUser) && message.sender.id != idUser).length
        const isOnline = !chat.isGroup ? !!chat.users.find((user) => user.id != idUser) : null

        return {
          idChat: chat.id,
          users: chat.users,
          name: chat.name,
          icon: chat.imageUrl,
          messages: messages,
          notRead: notRead,
          isGroup: chat.isGroup,
          isOnline: isOnline
        }

      }))
    } 
    catch (error) {
      throw new AppError("No chat found", 400);
    }
  }
}
