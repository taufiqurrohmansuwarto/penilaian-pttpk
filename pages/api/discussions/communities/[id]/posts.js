import nc from "next-connect";
import {
    create,
    index
} from "../../../../../controller/discussions-posts.controller";
import auth from "../../../../../middleware/auth";
const handler = nc();

export default handler.use(auth).get(index).create(create);
