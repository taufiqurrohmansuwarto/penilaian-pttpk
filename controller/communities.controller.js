const { default: prisma } = require("../lib/prisma");

// this is fucking subreddits
const index = async (req, res) => {
    try {
        let query = { type: "subreddit" };

        if (req.query?.title) {
            query = { ...query, title: req.query?.title };
        }

        const result = await prisma.discussions_posts.findMany({
            where: query
        });

        res.json(result);
    } catch (error) {
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

const detail = async (req, res) => {
    const { id } = req.query;
    try {
        const result = await prisma.discussions_posts.findFirst({
            where: {
                type: "subreddit",
                status: "active",
                title: id
            },
            include: {
                user: {
                    select: {
                        custom_id: true,
                        image: true,
                        username: true
                    }
                }
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
    const { body } = req;

    try {
        const check = await prisma.discussions_posts.findFirst({
            where: {
                status: "active",
                type: "subreddit",
                title: body?.title
            }
        });

        if (check) {
            res.status(403).json({ code: 404, message: "already exists" });
        } else {
            await prisma.discussions_posts.create({
                data: {
                    parent_id: null,
                    title: body?.title,
                    link: `/r/${body?.title}`,
                    content: body?.content,
                    status: "active",
                    user_custom_id: customId,
                    type: "subreddit"
                }
            });
            res.json({ code: 200, message: "success" });
        }
    } catch (e) {
        console.log(e);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const update = async (req, res) => {};

const remove = async (req, res) => {};

module.exports = {
    index,
    create,
    update,
    remove,
    detail
};
