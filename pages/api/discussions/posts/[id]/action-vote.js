import nc from "next-connect";
import auth from "../../../../../middleware/auth";
const handler = nc();

import {
    upvote,
    downvote
} from "../../../../../controller/discussions-votes.controller";

export default handler.use(auth).put(upvote).delete(downvote);
