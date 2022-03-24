import axios from "axios";
import { getSession } from "next-auth/react";

export default async (req, res, next) => {
    try {
        const data = await getSession({ req });
        if (data) {
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
            next();
        } else {
            res.status(401).json({ code: 401, message: "Not Authorized" });
        }
    } catch (error) {
        console.log(error);
    }
};
