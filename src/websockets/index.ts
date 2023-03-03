import { prisma } from "../config/prismaClient";
import { io } from "../http";
import { IChatProps, IMessageProps } from "./types";

io.on("connection", socket => {
  console.log(socket.id)
  
  socket.on("chat", async(data: IChatProps) => {
    await prisma.user.update({ where: { id: data.idUser }, data: { isActive: false } })

    socket.join(data.idChat)
  })

  socket.on("message", async(data: IMessageProps) => {
    const chat = await prisma.userFriend.findFirst({ where: { id: data.idChat } })  

    const message = await prisma.chatMessage.create({ data: {
      chat: { connect: { id: data.idChat }},
      sender: { connect: { id: chat.userId }},
      createdAt: new Date(),
      message: data.message
    }})

    io.to(data.idChat).emit("message", {idChat: chat.id, message: message})
  })
})

