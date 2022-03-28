import nc from "next-connect";
import auth from "../../../middleware/auth";
const handler = nc();

import multer from "multer";
import { uploadImageCategories } from "../../../controller/upload.controller";

export const config = {
    api: {
        bodyParser: false // Disallow body parsing, consume as stream
    }
};

export default handler.post(multer().array("image", 4), uploadImageCategories);
