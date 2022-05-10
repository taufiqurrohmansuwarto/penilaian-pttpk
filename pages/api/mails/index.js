import nc from "next-connect";
import { create, index } from "../../../controller/mail.controller";
import auth from "../../../middleware/auth";
const handler = nc();

export default handler.use(auth).post(create).get(index);
