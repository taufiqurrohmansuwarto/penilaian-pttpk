import nc from "next-connect";
import { create, index } from "../../../../controller/categories.controller";
import auth from "../../../../middleware/auth";
const handler = nc();

export default handler.use(auth).get(index).post(create);
