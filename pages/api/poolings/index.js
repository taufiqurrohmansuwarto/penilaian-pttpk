import nc from "next-connect";
import { getQuestion } from "../../../controller/pooling.controller";
import auth from "../../../middleware/auth";
const handler = nc();

export default handler.use(auth).get(getQuestion);
