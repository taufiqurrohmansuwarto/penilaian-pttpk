import nc from "next-connect";
import target_penilaianController from "../../../../../controller/target_penilaian.controller";
import auth from "../../../../../middleware/auth";
const handler = nc();

export default handler.use(auth).get(target_penilaianController.index);
