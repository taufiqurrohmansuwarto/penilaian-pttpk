import penilaianController from "../../../../controller/penilaian.controller";
import auth from "../../../../middleware/auth";
import nc from "next-connect";
const handler = nc();

export default handler.use(auth).get(penilaianController.index);
