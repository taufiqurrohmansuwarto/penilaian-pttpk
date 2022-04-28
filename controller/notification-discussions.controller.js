const { default: prisma } = require("../lib/prisma");

const index = async (req, res) => {
    const { customId } = req.user;
    try {
        const result = await prisma.discussions_notifications.findMany({
            where: {
                receiver: customId
            },
            include: {
                user_receiver_notification: true,
                user_sender_notification: true,
                discussion: {
                    include: {
                        parent_comments: true
                    }
                }
            },
            take: 25,
            orderBy: {
                created_at: "desc"
            }
        });

        const total = await prisma.discussions_notifications.count({
            where: {
                receiver: customId,
                is_read: false
            }
        });

        res.json({ result, total });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const put = async (req, res) => {
    const { customId } = req.user;
    try {
        await prisma.discussions_notifications.updateMany({
            where: {
                receiver: customId
            },
            data: {
                is_read: true
            }
        });
        res.json({ code: 200, messsage: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const patch = async (req, res) => {
    const { customId } = req.user;
    const { notificationId } = req.query;

    try {
        await prisma.discussions_notifications.updateMany({
            where: {
                id: notificationId,
                receiver: customId
            },
            data: {
                is_read: true
            }
        });
        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    index,
    put,
    patch
};
