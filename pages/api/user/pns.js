import nc from "next-connect";
import { getEmployee } from "../../../controller/pttpk.controller";
import auth from "../../../middleware/auth";
const handler = nc();

export default handler.use(auth).get(getEmployee);
