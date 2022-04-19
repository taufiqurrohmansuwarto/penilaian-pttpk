import nc from "next-connect";
import penilaianController from "../../../../../controller/penilaian.controller";
import auth from "../../../../../middleware/auth";
const handler = nc();

export default handler
    .use(auth)
    .get(penilaianController.get)
    .delete(penilaianController.remove)
    .patch(penilaianController.update)
    .put(penilaianController.active);
