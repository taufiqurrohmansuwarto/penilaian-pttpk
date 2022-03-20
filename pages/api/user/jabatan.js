import nc from "next-connect";
import { getJabatan } from "../../../controller/pttpk.controller";
import auth from "../../../middleware/auth";
const handler = nc();

export default handler.use(auth).get(getJabatan);
