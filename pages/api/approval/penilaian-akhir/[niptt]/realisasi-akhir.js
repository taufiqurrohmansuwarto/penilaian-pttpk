import nc from "next-connect";
import { detailPenilaianAkhirPTT } from "../../../../../controller/fasilitator-penilaian-akhir.controller";
import auth from "../../../../../middleware/auth";
const handler = nc();

export default handler.use(auth).get(detailPenilaianAkhirPTT);
