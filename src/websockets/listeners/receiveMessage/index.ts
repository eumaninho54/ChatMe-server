import { prisma } from "../../../config/prismaClient";
import { io } from "../../../http";
import { IReceiveMessageProps } from "./types";

export const handleOnReceiveMessage = async (data: IReceiveMessageProps) => {
  const chat = await prisma.chat.findFirst({ where: { id: data.idChat } });

  await prisma.chatMessage.update({
    where: {
      id: data.messageId,
    },
    data: {
      isReceivedBy: {
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