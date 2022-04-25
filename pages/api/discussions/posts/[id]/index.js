import nc from "next-connect";
import {
    detail,
    remove,
    update
} from "../../../../../controller/discussions-posts.controller";
import auth from "../../../../../middleware/auth";
const handler = nc();

export default handler.use(auth).get(detail).delete(remove).patch(update);
