import nc from "next-connect";
import { index } from "../../../controller/groups-chat.controller";
import auth from "../../../middleware/auth";
const handler = nc();

export default handler.use(auth).get(index);
