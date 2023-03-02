import { serverHttp } from "./http";
import "./websockets"

serverHttp.listen(3333, () => console.log("Working"));