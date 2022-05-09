import nc from "next-connect";
import { create, index } from "../../../../controller/pooling.controller";
import admin from "../../../../middleware/admin";
const handler = nc();

export default handler.use(admin).get(index).post(create);
