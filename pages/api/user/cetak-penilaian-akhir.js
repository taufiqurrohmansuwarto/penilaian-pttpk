import nc from "next-connect";
const handler = nc();

import { cetakPenilaianAkhirUser } from "../../../controller/cetak-penilaian.controller";
import auth from "../../../middleware/auth";

export default handler
    .use(auth)
    // .get(cetakPenilaianAkhirUser)
    .post(cetakPenilaianAkhirUser);
