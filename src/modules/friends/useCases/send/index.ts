import { SendController } from "./sendController";
import { SendUseCase } from "./sendUseCase";

const sendUseCase = new SendUseCase();

const sendController = new SendController(sendUseCase);

export { sendController };
