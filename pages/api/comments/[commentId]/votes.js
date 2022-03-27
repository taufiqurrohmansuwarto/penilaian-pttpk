import nc from "next-connect";
import commentsController from "../../../../controller/comments.controller";
import auth from "../../../../middleware/auth";
const handler = nc();

export default handler
    .use(auth)
    .delete(commentsController.dislikes)
    .put(commentsController.likes);
