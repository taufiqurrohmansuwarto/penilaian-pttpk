import nc from "next-connect";
import {
    batalKirimAtasanCuti,
    kirimAtasanCuti
} from "../../../controller/request-cuti.controller";
import auth from "../../../middleware/auth";
const handler = nc();

export default handler
    .use(auth)
    .put(kirimAtasanCuti)
    .delete(batalKirimAtasanCuti);
