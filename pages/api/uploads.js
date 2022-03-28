import nc from "next-connect";
import { upload } from "../../controller/upload.controller";
import auth from "../../middleware/auth";
import multer from "multer";

const handler = nc();

export const config = {
    api: {
        bodyParser: false // Disallow body parsing, consume as stream
    }
};

export default handler.use(auth).post(multer().single("image"), upload);
