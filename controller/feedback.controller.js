import moment from "moment";
import prisma from "../lib/prisma";

const create = async () => {
    const { userId } = req.user;
    const date = moment(new Date()).format("YYYY-MM-DD");

    try {
        await prisma.feedbacks.upsert({
            where: {
                user_custom_id_date: {
                    user_custom_id: req.user?.customId,
                    date
                }
            },
            create: {
                date,
                user_custom_id: userId
            },
            update: {
                date,
                user_custom_id: userId
            }
        });
        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

const index = async () => {
    const { userId } = req.user;
    const tanggal = moment(new Date()).format("YYYY-MM-DD");

    try {
        const result = await prisma.feedbacks.findUnique({
            where: {
                user_custom_id_date: {
                    user_custom_id: req.user?.customId,
                    date
                }
            }
        });
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    create,
    index
};
