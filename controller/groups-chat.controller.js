const { default: prisma } = require("../lib/prisma");

const index = async (req, res) => {
    try {
        const result = await prisma.groups_chats.findMany();
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const create = async (req, res) => {
    try {
        await prisma.groups_chats.create({
            data: {
                name: req?.body?.name
            }
        });
        res.json({ code: 200, message: "Success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const remove = async (req, res) => {
    const { id } = req?.query;
    try {
        await prisma.groups_chats.delete({
            where: {
                id
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
    create,
    remove
};
