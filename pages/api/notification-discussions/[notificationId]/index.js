import nc from "next-connect";
import {
    patch,
    put
} from "../../../../controller/notification-discussions.controller";
import auth from "../../../../middleware/auth";
const handler = nc();

export default handler.use(auth).patch(patch).put(put);
