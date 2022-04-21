import nc from "next-connect";
import { listPenilianBulanan } from "../../../controller/penilaian-fasilitator.controller";
import auth from "../../../middleware/auth";
const handler = nc();

export default handler.use(auth).get(listPenilianBulanan);
