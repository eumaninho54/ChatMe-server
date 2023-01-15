import { SignUpController } from "./signUpController";
import { SignUpUseCase } from "./signUpUseCase";

const signUpUseCase = new SignUpUseCase();

const signUpController = new SignUpController(signUpUseCase);

export { signUpController };
