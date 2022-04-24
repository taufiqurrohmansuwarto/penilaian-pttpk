const { default: prisma } = require("../lib/prisma");

const index = async (req, res) => {
    const { customId } = req.user;
    try {
        const result = await prisma.comments_notifications.findMany({
            where: {
                receiver: customId
            },
            include: {
                comments: {
                    include: {
                        user: true
                    }
                },
                user_receiver_notification: true,
                user_sender_notification: true
            },
            take: 25,
            orderBy: {
                created_at: "desc"
            }
        });

        const total = await prisma.comments_notifications.count({
            where: {
                receiver: customId,
                is_read: false
            }
        });

        res.json({ result, total });
    } catch (error) {
        console.log(error);
    }
};

const put = async (req, res) => {
    const { customId } = req.user;
    try {
        await prisma.comments_notifications.updateMany({
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
        await prisma.comments_notifications.updateMany({
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
