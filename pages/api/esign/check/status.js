import nc from "next-connect";
import { checkStatus } from "../../../../controller/esign.controller";
import auth from "../../../../middleware/auth";
const handler = nc();

export default handler
    .use(auth)
    .get(checkStatus)
    .all(async (req, res) => {});
