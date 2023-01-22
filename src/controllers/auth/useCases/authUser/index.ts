import { AuthUserController } from "./authUserController";
import { AuthUserUseCase } from "./authUserUseCase";

const authUserUseCase = new AuthUserUseCase();

const authUserController = new AuthUserController(authUserUseCase);

export { authUserController };
