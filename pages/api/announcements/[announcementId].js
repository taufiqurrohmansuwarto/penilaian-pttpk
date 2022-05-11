import nc from "next-connect";
import { remove, update } from "../../../controller/announcements.controller";
import auth from "../../../middleware/auth";
const handler = nc();

export default handler.use(auth).patch(update).delete(remove);
