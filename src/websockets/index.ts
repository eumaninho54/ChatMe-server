import { CreateNotificationBody } from "onesignal-node/lib/types";
import { prisma } from "../config/prismaClient";
import { io } from "../http";
import { IChatProps, IMessageProps } from "./types";
import * as OneSignal from 'onesignal-node';  
require("dotenv").config();

io.on("connection", socket => {
  socket.on("chat", async(data: IChatProps) => {
    await prisma.user.update({ where: { id: data.idUser }, data: { isActive: true } })

    socket.join(data.idChat)
  })

  socket.on("message", async(data: IMessageProps) => {
    const client = new OneSignal.Client(process.env.ONESIGNAL_APP_ID, process.env.ONESIGNAL_API_KEY);
    const chat = await prisma.chat.findFirst({ where: { id: data.idChat } })  

    const message = await prisma.chatMessage.create({ data: {
      chat: { connect: { id: chat.id }},
      sender: { connect: { id: data.idUser }},

      message: data.message
    }})

    try {
      const notification: CreateNotificationBody = {
        contents: {
          
        },
        include_player_ids: []
      }

      client.createNotification(notification)
    } 
    catch (err) {
      if (err instanceof OneSignal.HTTPError) {
        console.log(err.statusCode);
        console.log(err.body);
      }
    }

    io.to(data.idChat).emit("message", {idChat: chat.id, message: message})
  })
})

