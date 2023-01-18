import { IAuthUser } from "../../types/authUser";
require("dotenv").config();


export class AuthUserUseCase {
  async execute({ token }: IAuthUser) {
    return {
      auth: true,
      token: token
    }
  }
}

