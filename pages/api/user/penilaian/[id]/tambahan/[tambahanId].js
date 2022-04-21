import nc from "next-connect";
import {
    detail,
    remove,
    update
} from "../../../../../../controller/pekerjaan-tambahan.controller";
import auth from "../../../../../../middleware/auth";
const handler = nc();

export default handler.use(auth).get(detail).patch(update).delete(remove);
