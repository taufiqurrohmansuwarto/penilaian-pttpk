import nc from "next-connect";
import auth from "../../../middleware/auth";
const handler = nc();

import { cetakPenilaianAkhirUser } from "../../../controller/cetak-penilaian.controller";

export default handler.use(auth).get(cetakPenilaianAkhirUser);
