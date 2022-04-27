const { default: prisma } = require("../lib/prisma");

const index = async (req, res) => {
    const { customId } = req?.user;
    try {
        const result = await prisma.discussions_posts.findMany({
            where: {
                user_custom_id: customId,
                status: "active",
                type: "post"
            }
        });
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const patch = async (req, res) => {
    const { customId } = req.user;
    const [id] = req.query;
    try {
        await prisma.discussions_posts.updateMany({
            where: {
                user_custom_id: customId,
                status: "active",
                type: "post",
                id
            },
            data: req.body
        });
        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const remove = async (req, res) => {
    const { customId } = req?.user;
    const [id] = req.query;
    try {
        await prisma.discussions_posts.updateMany({
            where: {
                user_custom_id: customId,
                id,
                status: "active",
                type: "post"
            },
            data: {
                status: "nonactive"
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
    patch,
    remove
};
