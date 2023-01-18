import { VerifyTokenController } from "./verifyTokenController";
import { VerifyTokenUseCase } from "./verifyTokenUseCase";

const verifyTokenUseCase = new VerifyTokenUseCase();

const verifyTokenController = new VerifyTokenController(verifyTokenUseCase);

export { verifyTokenController };
