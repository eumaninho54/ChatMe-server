export interface IChatProps {
  idUser: string
  idChat: string[]
  name: string
}

export interface IMessageProps {
  idUser: string
  idChat: string
  message: string
  name: string
}

export interface RoomUser {
  socket_id: string
  name: string
  room: string
}