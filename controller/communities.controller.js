const { default: prisma } = require("../lib/prisma");

// this is fucking subreddits
const index = async (req, res) => {
    try {
        let query = { type: "subreddit" };

        if (req.query?.title) {
            query = {
                ...query,
                title: {
                    contains: req.query?.title,
                    mode: "insensitive"
                }
            };
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
                _count: {
                    select: {
                        discussions_posts_joined: true
                    }
                },
                user: true,
                parent: true,
                discussions_votes: true
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
            const result = await prisma.discussions_posts.create({
                data: {
                    parent_id: null,
                    title: body?.title,
                    link: `/r/${body?.title}`,
                    content: body?.content,
                    status: "active",
                    user_custom_id: customId,
                    type: "subreddit",
                    rules: body?.rules,
                    discussions_posts_topics: {
                        createMany: {
                            data: body?.topics?.map((topic) => ({
                                id_topic: topic
                            }))
                        }
                    },
                    discussions_posts_joined: {
                        create: {
                            user_custom_id: customId
                        }
                    }
                }
            });

            res.json(result);
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
