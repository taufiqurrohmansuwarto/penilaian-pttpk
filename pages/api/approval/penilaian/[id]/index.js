import nc from "next-connect";
import auth from "../../../../../middleware/auth";
const handler = nc();

import { getListPenilaianBulanan } from "../../../../../controller/approval.controller";

export default handler.use(auth).get(getListPenilaianBulanan);
