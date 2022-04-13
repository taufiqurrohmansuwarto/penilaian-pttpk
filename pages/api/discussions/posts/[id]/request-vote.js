import nc from "next-connect";
import subscribeDiscussionsController from "../../../../../controller/subscribe-discussions.controller";
import auth from "../../../../../middleware/auth";
const handler = nc();

export default handler
    .use(auth)
    .get(subscribeDiscussionsController.getSubscribesPosts)
    .put(subscribeDiscussionsController.subscribePost)
    .delete(subscribeDiscussionsController.unsubscribePost);
