import nc from "next-connect";
import auth from "../../../middleware/auth";
const handler = nc();

import multer from "multer";

export const config = {
    api: {
        bodyParser: false // Disallow body parsing, consume as stream
    }
};

export default handler.use(auth).get().post(multer().single("image"));
