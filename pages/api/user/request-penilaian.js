import nc from "next-connect";
import {
    batalKirimAtasan,
    kirimAtasan
} from "../../../controller/penilaian-request.controller";
import auth from "../../../middleware/auth";
const handler = nc();

export default handler.use(auth).put(kirimAtasan).delete(batalKirimAtasan);
