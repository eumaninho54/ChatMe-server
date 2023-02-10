import { SearchController } from "./searchController";
import { SearchUseCase } from "./searchUseCase";

const searchUseCase = new SearchUseCase();

const searchController = new SearchController(searchUseCase);

export { searchController };
