import axios from "axios";
import { getSession } from "next-auth/react";
const Minio = require("minio");

const mc = new Minio.Client({
    port: parseInt(process.env.MINIO_PORT),
    endPoint: process.env.MINIO_ENDPOINT,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESSKEY,
    secretKey: process.env.MINIO_SECRETKEY
});

// only authenticated user can upload file

export default async (req, res, next) => {
    try {
        const data = await getSession({ req });
        // idku
        if (data && data?.user?.id === "master|56543") {
            const { accessToken: token } = data;
            const userId = data?.user?.id?.split("|")?.[1];
            const customId = data?.user?.id;
            const userType = data?.user?.id?.split("|")?.[0];

            const fetcher = axios.create({
                baseURL: process.env.PROTECTED_URL,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            req.fetcher = fetcher;
            req.user = {
                ...data?.user,
                userId: parseInt(userId, 10),
                customId,
                userType
            };
            req.mc = mc;
            next();
        } else {
            res.status(401).json({ code: 401, message: "Not Authorized" });
        }
    } catch (error) {
        console.log(error);
    }
};
