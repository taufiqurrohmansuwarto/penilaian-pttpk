import nc from "next-connect";
import target_penilaianController from "../../../../../../controller/target_penilaian.controller";
import auth from "../../../../../../middleware/auth";
const handler = nc();

export default handler
  .use(auth)
  .patch(target_penilaianController.update)
  .delete(target_penilaianController.remove);
