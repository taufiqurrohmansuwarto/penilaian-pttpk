import nc from "next-connect";
import penilaian_bulananController from "../../../../../../controller/penilaian_bulanan.controller";
import auth from "../../../../../../middleware/auth";
const handler = nc();

export default handler
    .use(auth)
    .get(penilaian_bulananController.detail)
    .delete(penilaian_bulananController.remove)
    .patch(penilaian_bulananController.update);
