import nc from "next-connect";
import admin from "../../../../middleware/admin";

import {
    update,
    remove
} from "../../../../controller/announcements.controller";
const handler = nc();

export default handler.use(admin).patch(update).delete(remove);
