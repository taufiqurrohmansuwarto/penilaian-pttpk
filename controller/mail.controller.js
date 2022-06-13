// untuk keperluan email

const { default: prisma } = require("../lib/prisma");

const index = async (req, res) => {
    // should infinite scroll
    const { customId } = req?.user;
    const type = req?.query?.type || "inbox";

    //
    const limit = parseInt(req?.query?.limit) || 10;
    const offset = parseInt(req?.query?.offset) || 0;
    let total = 0;

    // default inbox
    let query;
    const queryInbox = {
        where: {
            users_messages_mapped: {
                some: {
                    user_custom_id: customId
                }
            }
        },
        include: {
            author: true,
            users_messages_mapped: {
                where: {
                    placeholder_id: "inbox"
                },
                include: {
                    user: true
                }
            }
        },
        orderBy: {
            date: "desc"
        }
    };

    const querySent = {
        where: {
            user_custom_id: customId
        },
        include: {
            author: true,
            users_messages_mapped: {
                where: {
                    placeholder_id: "sent"
                },
                include: {
                    user: true
                }
            }
        },
        orderBy: {
            date: "desc"
        }
    };

    if (type === "inbox") {
        query = { ...queryInbox, take: limit, skip: offset };
        const currentTotal = await prisma.users_messages_mapped.count({
            where: {
                user_custom_id: customId,
                placeholder_id: "inbox"
            }
        });
        total = currentTotal;
    } else if (type === "sent") {
        const currentTotal = await prisma.users_messages_mapped.count({
            where: {
                user_custom_id: customId,
                placeholder_id: "sent"
            }
        });
        query = { ...querySent, take: limit, skip: offset };
        total = currentTotal;
    }

    try {
        if (type === "count") {
            const result = await prisma.users_messages_mapped.count({
                where: {
                    user_custom_id: customId,
                    is_read: false,
                    placeholder: "inbox"
                }
            });
            res.json(result);
        } else {
            const result = await prisma.messages.findMany(query);
            const data = {
                result,
                total,
                meta: {
                    offset,
                    limit
                }
            };

            res.json(data);
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const create = async (req, res) => {
    const { customId } = req?.user;
    const { body } = req;
    try {
        await prisma.messages.create({
            data: {
                user_custom_id: customId,
                body: body?.message,
                date: new Date(),
                subject: body?.subject,
                users_messages_mapped: {
                    createMany: {
                        data: [
                            {
                                placeholder_id: "inbox",
                                user_custom_id: body?.receiver
                            },
                            {
                                placeholder_id: "sent",
                                user_custom_id: body?.receiver
                            }
                        ]
                    }
                }
            }
        });

        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const detail = async (req, res) => {
    const { mailId } = req?.query;

    try {
        const result = await prisma.messages.findUnique({
            where: {
                id: mailId
            },
            include: {
                users_messages_mapped: {
                    include: {
                        user: true
                    }
                }
            }
        });

        await prisma.users_messages_mapped.updateMany({
            where: {
                message_id: mailId,
                placeholder_id: "inbox"
            },
            data: {
                is_read: true
            }
        });

        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

// update the motherfucker
const update = async (req, res) => {
    const { customId } = req?.user;
    try {
    } catch (error) {}
};

const remove = async (req, res) => {
    const { customId } = req?.user;
    try {
    } catch (error) {}
};

module.exports = {
    index,
    create,
    detail,
    update,
    remove
};
