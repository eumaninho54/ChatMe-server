import { SearchDTO } from "../../types/search";
import { AppError } from "../../../../errors/appError";
import { prisma } from "../../../../config/prismaClient";
require("dotenv").config();

export class SearchUseCase {
  async execute({ username, idUser }: SearchDTO) {
    try {
      const searchedUsers = await prisma.user.findMany({
        where: { 
          name: { contains: username.trim() , mode: 'insensitive' }, 
          id: { not: idUser },
          friends: { none: { friendId: idUser  } }
        },
        take: 3
      });

      return await Promise.all(searchedUsers.map(async(searchedUser) => {
        const hasFriendshipRequest = await prisma.friendshipRequest.findFirst({
          where: { senderId: idUser, receiverId: searchedUser.id }
        })

        return {
          id: searchedUser.id,
          username: searchedUser.name,
          imageUrl: searchedUser.imageUrl,
          hasFriendshipRequest: hasFriendshipRequest ? true : false
        }
      }))
    }
    catch (error) {
      throw new AppError("User not found", 400);
    }
  }
}
