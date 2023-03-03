export interface IChatProps {
  idUser: string
  idChat: string[]
  username: string
}

export interface IMessageProps {
  idUser: string
  idChat: string
  message: string
  username: string
}

export interface RoomUser {
  socket_id: string
  username: string
  room: string
}