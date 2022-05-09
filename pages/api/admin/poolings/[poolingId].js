import nc from "next-connect";
import { remove } from "../../../../controller/pooling.controller";
import admin from "../../../../middleware/admin";
const handler = nc();

export default handler.use(admin).delete(remove);
