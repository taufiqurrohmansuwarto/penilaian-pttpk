import nc from "next-connect";
import refController from "../../../controller/ref.controller";
import auth from "../../../middleware/auth";
const handler = nc();

export default handler.use(auth).get(refController.ref);
