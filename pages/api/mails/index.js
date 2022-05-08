import nc from "next-connect";
import auth from "../../../middleware/auth";
const handler = nc();

export default handler.use(auth).get();
