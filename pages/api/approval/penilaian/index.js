import nc from "next-connect";
import auth from "../../../../middleware/auth";
import { dataPenilaian } from "../../../../controller/approval.controller";

const handler = nc();

export default handler.use(auth).get(dataPenilaian);
