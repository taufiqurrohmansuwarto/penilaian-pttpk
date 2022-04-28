import nc from "next-connect";
import allRequestDiscussionsController from "../../../../../controller/all-request-discussions.controller";
import auth from "../../../../../middleware/auth";
const handler = nc();

export default handler.use(auth).put(allRequestDiscussionsController);
