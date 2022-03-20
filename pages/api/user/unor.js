import nc from "next-connect";
import { getUnor } from "../../../controller/pttpk.controller";
import auth from "../../../middleware/auth";

const handler = nc();

export default handler.use(auth).get(getUnor);
