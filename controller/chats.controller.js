import prisma from "../lib/prisma";

const create = async (req, res) => {
    try {
        const { customId } = req?.user;
        const body = req?.body;

        await prisma.chats.create({
            data: {
                group_id: req.query?.id,
                message: body?.message,
                user_custom_id: customId
            }
        });

        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const index = async (req, res) => {
    const { id } = req.query;

    try {
        const result = await prisma.chats.findMany({
            where: {
                group_id: id
            },
            include: {
                user: true
            }
        });
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    create,
    index
};
