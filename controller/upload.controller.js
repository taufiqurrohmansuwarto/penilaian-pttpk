const path = require("path");
const crypto = require("crypto");

const URL_FILE = process.env.URL_FILE;

const { uploadFileMinio } = require("../utils/minio");

const upload = async (req, res) => {
    console.log(req.file);
    const { buffer, originalname, size, mimetype } = req?.file;
    // const { userId, customId } = req.user;
    const extFile = path.extname(originalname);
    const id = crypto.randomBytes(20).toString("hex");
    const currentFilename = `${id}_${originalname}${extFile}`;

    try {
        await uploadFileMinio(req.mc, buffer, currentFilename, size, mimetype);
        const result = `${URL_FILE}/${currentFilename}`;
        console.log(result);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    upload
};
