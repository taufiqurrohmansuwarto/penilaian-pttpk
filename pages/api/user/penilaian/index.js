import penilaianController from "../../../../controller/penilaian.controller";
import nc from "next-connect";
import handler from "../../../../lib/handler";

export default handler
  //   .create(penilaianController.create)
  .get(penilaianController.index);
