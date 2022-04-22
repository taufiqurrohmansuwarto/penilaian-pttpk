import nc from "next-connect";
import auth from "../../../../middleware/auth";
import {
    index,
    create
} from "../../../../controller/satuan_kinerja.controller";
const handler = nc();

export default handler.use(auth).get(index).post(create);
