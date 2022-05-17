import nc from "next-connect";
import { index, create } from "../../../../controller/announcements.controller";
import admin from "../../../../middleware/admin";

const handler = nc();

export default handler.use(admin).get(index).post(create);
