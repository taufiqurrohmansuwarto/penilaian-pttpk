import nc from "next-connect";
import { answer } from "../../../controller/pooling.controller";
import auth from "../../../middleware/auth";
const handler = nc();

export default handler.use(auth).put(answer);
