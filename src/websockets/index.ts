import { io } from "../http";
import {
  handleOnChat,
  IChatProps,
  handleOnNewMessage,
  INewMessageProps,
  handleOnReadMessage,
  IReadMessageProps,
  IReceiveMessageProps,
  handleOnReceiveMessage,
} from "./listeners";
import * as OneSignal from "@onesignal/node-onesignal";
require("dotenv").config();

const configuration = OneSignal.createConfiguration({
  authMethods: {
    app_key: {
      tokenProvider: { getToken: () => process.env.ONESIGNAL_API_KEY },
    },
  },
});
const client = new OneSignal.DefaultApi(configuration);

io.on("connection", (socket) => {
  socket.on("chat", async (data: IChatProps) => {
    await handleOnChat(data, socket);
  });

  socket.on("newMessage", async (data: INewMessageProps) => {
    await handleOnNewMessage(data, client);
  });

  socket.on("readMessage", async (data: IReadMessageProps) => {
    await handleOnReadMessage(data);
  });

  socket.on("receiveMessage", async (data: IReceiveMessageProps) => {
    await handleOnReceiveMessage(data)
  });
});
