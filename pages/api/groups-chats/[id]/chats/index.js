import nc from "next-connect";
import auth from "../../../../../middleware/auth";
import { create, index } from "../../../../../controller/chats.controller";

const handler = nc();

export default handler.use(auth).post(create).get(index);
