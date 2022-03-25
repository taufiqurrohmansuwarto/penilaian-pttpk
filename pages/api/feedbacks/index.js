import nc from "next-connect";
import feedbackController from "../../../controller/feedback.controller";
import auth from "../../../middleware/auth";
const handler = nc();

export default handler
    .use(auth)
    .get(feedbackController.get)
    .post(feedbackController.create);
