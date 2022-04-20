import nc from "next-connect";
import { cetakPenilaianBulananUser } from "../../../controller/cetak-penilaian.controller";
import auth from "../../../middleware/auth";
const handler = nc();

export default handler.use(auth).get(cetakPenilaianBulananUser);
