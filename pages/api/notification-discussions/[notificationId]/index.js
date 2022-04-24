import nc from "next-connect";
import { patch } from "../../../../controller/notification-comment.controller";
import auth from "../../../../middleware/auth";
const handler = nc();

export default handler.use(auth).patch(patch);
