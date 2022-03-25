// upload file via minio
const uploadFileMinio = (mc, fileBuffer, filename, size, mimetype) => {
    return new Promise((resolve, reject) => {
        mc.putObject(
            "social-media",
            `files/${filename}`,
            fileBuffer,
            size,
            // cant be metadata add some username and department?
            { "Content-Type": mimetype },
            function (err, info) {
                if (err) {
                    reject(err);
                    console.log(error);
                } else {
                    resolve(info);
                }
            }
        );
    });
};

module.exports = {
    uploadFileMinio
};
