import nc from "next-connect";
import auth from "../../../../../middleware/auth";
const handler = nc();

// akan diisi prosentase motherfucker
export default handler.use(auth).get();
