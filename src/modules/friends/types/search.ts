import { VerifyTokenDTO } from "../../auth/types/verifyToken"

export type SearchDTO = {
  username: string
  idUser: string
} & VerifyTokenDTO