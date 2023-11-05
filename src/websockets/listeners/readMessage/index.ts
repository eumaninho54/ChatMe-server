import { prisma } from "../../../config/prismaClient";
import { io } from "../../../http";
import { IReadMessageProps } from "./types";

export const handleOnReadMessage = async (data: IReadMessageProps) => {
  const chat = await prisma.chat.findFirst({ where: { id: data.idChat } });

  await prisma.chatMessage.updateMany({
    where: {
      idChat: data.idChat,
      id: {
        in: data.messagesId,
      },
    },
    data: {
      isReadBy: {
        push: data.idUser,
      },
    },
  });

  const allMessages = await prisma.chatMessage.findMany({
    where: { idChat: data.idChat },
    select: {
      id: true,
      message: true,
      isReceivedBy: true,
      isReadBy: true,
      createdAt: true,
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          isActive: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  io.to(data.idChat).emit("editMessage", {
    idChat: chat.id,
    messages: allMessages,
  });
};

export * from "./types"