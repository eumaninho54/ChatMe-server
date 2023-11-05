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

  socket.on("newMessage", async(data: IMessageProps) => {
    const client = new OneSignal.Client(process.env.ONESIGNAL_APP_ID, process.env.ONESIGNAL_API_KEY);
    const chat = await prisma.chat.findFirst({ where: { id: data.idChat } })  

    const message = await prisma.chatMessage.create({ 
      data: {
        chat: { connect: { id: chat.id }},
        sender: { connect: { id: data.idUser }},
        createdAt: new Date(),
        message: data.message,
        isReceivedBy: [data.idUser],
        isReadBy: [data.idUser]
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
          } 
        },
      }
    })

    const allMessages = await prisma.chatMessage.findMany({
      where: { idChat: chat.id },
      orderBy: { createdAt: 'desc' },
      select: { 
        isReadBy: true,
        sender: { 
          select: { 
            id: true,
          } 
        },
      },
      take: 20
    })

    try {
      const notification: CreateNotificationBody = {
        contents: {
          
        },
        include_player_ids: []
      }

      //client.createNotification(notification)
    } 
    catch (err) {
      if (err instanceof OneSignal.HTTPError) {
        console.log(err.statusCode);
        console.log(err.body);
      }
    }
    io.to(data.idChat).emit("newMessage", {
      idChat: chat.id, 
      message: message
    })
  })

  socket.on("readMessage", async(data: IReadMessageProps) => {
    const chat = await prisma.chat.findFirst({ where: { id: data.idChat } })

    await prisma.chatMessage.updateMany({
      where: {
        idChat: data.idChat, 
        id: {
          in: data.messagesId
        } 
      },
      data: {
        isReadBy: {          
          push: data.idUser
        }
      }
    })
    

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
          } 
        },
      },
      orderBy: { createdAt: "desc" }
    })

    io.to(data.idChat).emit("editMessage", {
      idChat: chat.id, 
      messages: allMessages
    })
  })

  })
})

