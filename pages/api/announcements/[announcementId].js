import nc from "next-connect";
import { remove, update } from "../../../controller/announcements.controller";
const handler = nc();

export default handler.use().patch(update).delete(remove);
