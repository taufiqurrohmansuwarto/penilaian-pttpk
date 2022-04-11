const { default: prisma } = require("../lib/prisma");
const index = async (req, res) => {
    const { id } = req.query;

    try {
        const community = await prisma.discussions_posts.findFirst({
            where: {
                title: id
            }
        });

        const result = await prisma.discussions_posts.findMany({
            where: {
                parent_id: community?.id,
                status: "active",
                type: "post"
            },
            include: {
                _count: {
                    select: {
                        children: true
                    }
                },
                user: true
            },
            orderBy: {
                created_at: "desc"
            }
        });

        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const create = async (req, res) => {
    const { customId } = req.user;
    const { id } = req.query;
    const { body } = req;
    try {
        const result = await prisma.discussions_posts.findFirst({
            where: {
                title: id,
                type: "subreddit",
                status: "active"
            }
        });

        if (!result) {
            res.status(404).json({ code: 404, message: "not found" });
        } else {
            const id = result?.id;
            const currentData = {
                parent_id: id,
                title: body?.title,
                content: body?.description,
                type: "post",
                status: "active",
                user_custom_id: customId
            };

            await prisma.discussions_posts.create({
                data: currentData
            });

            res.json({ code: 200, message: "sukses" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const update = async (req, res) => {};
const remove = async (req, res) => {};

const detail = async (req, res) => {
    const { id } = req.query;
    try {
        res.json();
    } catch (error) {
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    index,
    create,
    update,
    remove,
    detail
};
