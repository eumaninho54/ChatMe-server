import { AppError } from "../../../../errors/appError";
import { prisma } from "../../../../config/prismaClient";
import { GetDTO } from "../../types/get";
require("dotenv").config();

export class GetAllUseCase {
  async execute({ idUser }: GetDTO) {

    if(!idUser) throw new AppError("No authorization", 401);

    try {
      const friendChat = await prisma.userFriend.findMany({ 
        where: { userId: idUser },
        select: { id: true, friend: true, friendId: true }
      })

      return await Promise.all(friendChat.map(async(friendChat) => {
        const messages = await prisma.userMessage.findMany({
          where: { 
            OR: [
              { receiverId: idUser, senderId: friendChat.friendId },
              { receiverId: friendChat.friendId, senderId: idUser }
            ],
          },
          orderBy: { createdAt: 'desc' },
          select: { 
            message: true, 
            isRead: true, 
            isReceived: true, 
            createdAt: true, 
            id: true, 
            senderId: true,
            receiverId: true
          },
          take: 20
        })

        const notRead = messages.filter((message) => message.receiverId == idUser && !message.isRead ).length

        return {
          idChat: friendChat.id,
          usernameFriend: friendChat.friend.name,
          avatarFriend: friendChat.friend.imageUrl,
          messages: messages,
          notRead: notRead,
          isOnline: friendChat.friend.isActive
        }

      }))
    } 
    catch (error) {
      throw new AppError("No chat found", 400);
    }
  }
}
