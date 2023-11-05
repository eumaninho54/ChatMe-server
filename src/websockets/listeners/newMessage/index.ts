import { prisma } from "../../../config/prismaClient";
import { io } from "../../../http";
import { INewMessageProps } from "./types";
import * as OneSignal from "@onesignal/node-onesignal";

export const handleOnNewMessage = async (
  data: INewMessageProps,
  client: OneSignal.DefaultApi
) => {
  const chat = await prisma.chat.findUnique({
    where: { id: data.idChat },
    select: {
      id: true,
      users: { 
        where: { 
          id: { 
            not: data.idUser 
          } 
        } 
      },
    },
  });

  const message = await prisma.chatMessage.create({
    data: {
      chat: { connect: { id: chat.id } },
      sender: { connect: { id: data.idUser } },
      createdAt: new Date(),
      message: data.message,
      isReceivedBy: [data.idUser],
      isReadBy: [data.idUser],
    },
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
  });

  try {
    const notification = new OneSignal.Notification();
    notification.app_id = process.env.ONESIGNAL_APP_ID;
    notification.name = "testando";
    notification.included_segments = ["Subscribed Users"];
    notification.contents = {
      en: "Hello OneSignal!",
    };
    notification.include_external_user_ids = chat.users.map((item) => item.id)

    await client.createNotification(notification);
  } catch (err) {
    console.log(err);
    console.log("error");
  }
  io.to(data.idChat).emit("newMessage", {
    idChat: chat.id,
    message: message,
  });
};

export * from "./types";
