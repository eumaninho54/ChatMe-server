import { prisma } from "../config/prismaClient";
import { io } from "../http";
import { IChatProps, IMessageProps } from "./types";

io.on("connection", socket => {
  console.log(socket.id)
  
  socket.on("chat", async(data: IChatProps) => {
    await prisma.user.update({ where: { id: data.idUser }, data: { isActive: true } })

    socket.join(data.idChat)
  })

  socket.on("message", async(data: IMessageProps) => {
    const chat = await prisma.chat.findFirst({ where: { id: data.idChat } })  

    const message = await prisma.chatMessage.create({ data: {
      chat: { connect: { id: chat.id }},
      sender: { connect: { id: data.idUser }},
      createdAt: new Date(),
      message: data.message
    }})

    io.to(data.idChat).emit("message", {idChat: chat.id, message: message})
  })
})

