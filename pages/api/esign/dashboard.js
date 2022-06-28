import nc from "next-connect";
import { currentDashboard } from "../../../controller/esign.controller";
import auth from "../../../middleware/auth";
const handler = nc();

export default handler.use(auth).get(currentDashboard);
