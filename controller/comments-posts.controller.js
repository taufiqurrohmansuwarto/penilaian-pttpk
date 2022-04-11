const { default: prisma } = require("../lib/prisma");
const arrayToTree = require("array-to-tree");

const index = async (req, res) => {
    const { customId } = req.user;
    const { id } = req.query;
    try {
        const result = await prisma.discussions_posts.findMany({
            where: {
                post_id: id,
                type: "comment",
                status: "active"
            }
        });

        res.json(
            arrayToTree(result, { customID: "id", parentProperty: "parent_id" })
        );
    } catch (error) {
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const detail = async (req, res) => {
    try {
    } catch (error) {
        console.log(error);
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

const create = async (req, res) => {
    const { customId } = req.user;
    const { body } = req;
    const { id } = req.query;

    try {
        await prisma.discussions_posts.create({
            data: {
                parent_id: body?.parent_id,
                post_id: id,
                status: "active",
                type: "comment",
                user_custom_id: customId
            }
        });
        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const update = async (req, res) => {
    try {
    } catch (error) {
        console.log(error);
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

const remove = async (req, res) => {
    try {
    } catch (error) {
        console.log(error);
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    index,
    detail,
    create,
    update,
    remove
};
