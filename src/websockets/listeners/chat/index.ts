import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { IChatProps } from "./types";
import { prisma } from "../../../config/prismaClient";

export const handleOnChat = async (
  data: IChatProps,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  await prisma.user.update({
    where: { id: data.idUser },
    data: { isActive: true },
  });
  socket.join(data.idChat);
};

export * from './types'
