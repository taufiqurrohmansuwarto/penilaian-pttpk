import nc from "next-connect";
import {
    batalKirimAtasanUser,
    kirimAtasanUser
} from "../../../controller/acc-kinerja-akhir.controller";
import auth from "../../../middleware/auth";
const handler = nc();

export default handler
    .use(auth)
    .put(kirimAtasanUser)
    .delete(batalKirimAtasanUser);
