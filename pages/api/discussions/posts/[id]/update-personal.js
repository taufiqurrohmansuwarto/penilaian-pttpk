import nc from "next-connect";
import {
    removePostPersonal,
    updatePostPersonal
} from "../../../../../controller/discussions-posts.controller";
import auth from "../../../../../middleware/auth";
const handler = nc();

export default handler
    .use(auth)
    .patch(updatePostPersonal)
    .delete(removePostPersonal);
