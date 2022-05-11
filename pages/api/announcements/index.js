import nc from "next-connect";
import { create, index } from "../../../controller/announcements.controller";

const handler = nc();

export default handler.use().get(index).post(create);
