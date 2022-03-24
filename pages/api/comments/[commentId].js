import nc from "next-connect";
import commentsController from "../../../controller/comments.controller";
const handler = nc();

export default handler
    .delete(commentsController.remove)
    .patch(commentsController.update);
