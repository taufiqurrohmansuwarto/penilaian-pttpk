import nc from "next-connect";
import { all } from "../../controller/announcements.controller";
import auth from "../../middleware/auth";
const handler = nc();

export default handler.use(auth).get(all);
