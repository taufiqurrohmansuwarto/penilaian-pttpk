import nc from "next-connect";
import { upload } from "../../controller/upload.controller";
import auth from "../../middleware/auth";
const handler = nc();

export default handler.use(auth).post(upload);
