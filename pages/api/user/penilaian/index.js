import nc from "next-connect";
import penilaianController from "../../../../controller/penilaian.controller";
import auth from "../../../../middleware/auth";
const handler = nc();

export default handler
  .use(auth)
  .get(penilaianController.index)
  .post(penilaianController.create)
  .delete(penilaianController.remove);
