import nc from "next-connect";
import { listDocuments } from "../../../../controller/esign.controller";
import auth from "../../../../middleware/auth";
const handler = nc();

export default handler.use(auth).get(listDocuments);
