import nc from "next-connect";
import commentsController from "../../../../controller/comments.controller";
import auth from "../../../../middleware/auth";
const handler = nc();

export default handler
    .use(auth)
    .get(commentsController.get)
    .delete(commentsController.remove)
    .patch(commentsController.update);
