import penilaian_bulananController from "../../../../../controller/penilaian_bulanan.controller";
import nc from "next-connect";
const handler = nc();

export default handler.get(penilaian_bulananController.index);
