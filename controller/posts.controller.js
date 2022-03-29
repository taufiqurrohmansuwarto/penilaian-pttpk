const { default: prisma } = require("../lib/prisma");

const index = async (req, res) => {
    // its cursor based pagination
    try {
        const result = await prisma.discussions_posts.findMany({
            where: {
                parent_id: {
                    not: null
                }
            },
            orderBy: {
                created_at: "desc"
            }
        });
        res.json(result);
    } catch (error) {
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

const create = async (req, res) => {
    const { customId, image, name } = req.user;
    const data = { user_custom_id: customId, avatar: image, username: name };
    const { parentId } = req.body;

    try {
        await prisma.discussions_posts.create({
            data: {
                ...data,
                type: "post",
                active: true,
                parent_id: parentId
            }
        });
        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

const detail = async (req, res) => {
    try {
    } catch (error) {}
};

const remove = async (req, res) => {
    try {
    } catch (error) {}
};

const update = async (req, res) => {
    try {
    } catch (error) {}
};

module.exports = {
    index,
    create,
    detail,
    remove,
    update
};
