import nc from "next-connect";
import auth from "../../../middleware/auth";

const handler = nc();
import { requestPenilaianUser } from "../../../controller/acc-kinerja-bulanan.controller";

export default handler.use(auth).get(requestPenilaianUser);
