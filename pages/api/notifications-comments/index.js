import nc from "next-connect";
import {
    index,
    put
} from "../../../controller/notification-comment.controller";
import auth from "../../../middleware/auth";
const handler = nc();

export default handler.use(auth).get(index).put(put);
