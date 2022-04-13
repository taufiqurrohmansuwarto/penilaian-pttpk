import nc from "next-connect";
import auth from "../../../middleware/auth";
import {
    listSubscribes,
    subscribe,
    unsubscribe
} from "../../../controller/subscribe-discussions.controller";

const handler = nc();

export default handler
    .use(auth)
    .get(listSubscribes)
    .put(subscribe)
    .delete(unsubscribe);
