const { default: prisma } = require("../lib/prisma");

const index = async (req, res) => {
    const { customId } = req?.user;
    try {
        const result = await prisma.announcements.findFirst({
            where: {
                user_custom_id: customId
            }
        });
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const all = async (req, res) => {
    try {
        const result = await prisma.announcements.findFirst();
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const detail = async (req, res) => {
    try {
    } catch (error) {}
};

const create = async (req, res) => {
    const data = req?.body;
    const { customId } = req?.user;
    try {
        await prisma.announcements.create({
            data: {
                ...data,
                user_custom_id: customId
            }
        });
        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

const update = async (req, res) => {
    const { announcementId } = req?.query;
    const { customId } = req?.user;
    const data = req?.body;

    try {
        await prisma.announcements.updateMany({
            where: {
                id: announcementId,
                user_custom_id: customId
            },
            data: {
                title: data?.title,
                description: data?.description
            }
        });
        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const remove = async (req, res) => {
    try {
    } catch (error) {}
};

module.exports = {
    index,
    create,
    update,
    detail,
    remove,
    all
};
