import nc from "next-connect";
import auth from "../../../../../middleware/auth";
import {
    get,
    update,
    remove
} from "../../../../../controller/satuan_kinerja.controller";
const handler = nc();

export default handler.use(auth).get(get).patch(update).delete(remove);
