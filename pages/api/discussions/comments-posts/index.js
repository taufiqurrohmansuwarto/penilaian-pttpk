import nc from "next-connect";
const handler = nc();
import auth from "../../../../middleware/auth";

export default handler.use(auth).get().post();
