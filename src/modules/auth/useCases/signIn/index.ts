import { SignInController } from "./signInController";
import { SignInUseCase } from "./signInUseCase";

const signInUseCase = new SignInUseCase();

const signInController = new SignInController(signInUseCase);

export { signInController };
