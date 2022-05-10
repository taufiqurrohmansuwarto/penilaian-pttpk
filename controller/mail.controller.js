// untuk keperluan email

const { default: prisma } = require("../lib/prisma");

const index = async (req, res) => {
    // should infinite scroll
    const { customId } = req?.user;
    const type = req?.query?.type || "inbox";

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
            users_messages_mapped: {
                where: {
                    placeholder_id: "inbox"
                }
            }
        }
    };

    const querySent = {
        where: {
            user_custom_id: customId
        },
        include: {
            users_messages_mapped: {
                where: {
                    placeholder_id: "sent"
                }
            }
        }
    };

    if (type === "inbox") {
        query = queryInbox;
    } else if (type === "sent") {
        query = querySent;
    }

    console.log(type);

    try {
        const result = await prisma.messages.findMany(query);
        res.json(result);
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
    const { customId } = req?.user;
    try {
    } catch (error) {}
};

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
