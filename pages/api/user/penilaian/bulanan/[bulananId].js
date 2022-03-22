import nc from "next-connect";
import penilaian_bulananController from "../../../../../controller/penilaian_bulanan.controller";
import auth from "../../../../../middleware/auth";
const handler = nc();

export default handler
    .use(auth)
    .delete(penilaian_bulananController.remove)
    .put(penilaian_bulananController.update);
