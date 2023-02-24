import { GetAllController } from "./getAllController";
import { GetAllUseCase } from "./getAllUseCase";

const getAllUseCase = new GetAllUseCase();

const getAllController = new GetAllController(getAllUseCase);

export { getAllController };
