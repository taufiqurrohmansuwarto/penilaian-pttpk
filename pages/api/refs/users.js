import nc from "next-connect";
import { findUsers } from "../../../controller/refs.controller";
import auth from "../../../middleware/auth";
const handler = nc();

export default handler.use(auth).get(findUsers);
