import nc from "next-connect";
import { detail } from "../../../controller/mail.controller";
import auth from "../../../middleware/auth";
const handler = nc();

export default handler.use(auth).get(detail);
