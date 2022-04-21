import nc from "next-connect";
import { listPenilaianTahunan } from "../../../controller/penilaian-fasilitator.controller";
import auth from "../../../middleware/auth";
const handler = nc();

export default handler.use(auth).get(listPenilaianTahunan);
