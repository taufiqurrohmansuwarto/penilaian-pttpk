import nc from "next-connect";
import {
    accKinerjaApproval,
    listKinerjaApproval
} from "../../../../controller/acc-kinerja-akhir.controller";
import auth from "../../../../middleware/auth";
const handler = nc();

export default handler
    .use(auth)
    .get(listKinerjaApproval)
    .put(accKinerjaApproval);
