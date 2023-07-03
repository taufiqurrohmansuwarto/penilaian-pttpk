import nc from "next-connect";
const handler = nc();
import { rekapPenilaianAkhirPTT } from "../../../../controller/user-rekap-penilaian-akhir";
import auth from "../../../../middleware/auth";

handler.use(auth).get(rekapPenilaianAkhirPTT);

export default handler;
