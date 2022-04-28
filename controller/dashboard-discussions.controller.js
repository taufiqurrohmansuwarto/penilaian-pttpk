const { default: prisma } = require("../lib/prisma");

const index = async (req, res) => {
    try {
        const type = req?.query?.type || "teratas";

        let query = {
            where: {
                status: "active"
            },
            take: 5
        };

        if (type === "teratas") {
            query = {
                ...query,
                where: {
                    ...query.where,
                    type: "post"
                },
                orderBy: {
                    votes: "desc"
                }
            };
        }

        if (type === "ramai") {
            query = {
                ...query,
                where: {
                    ...query?.where,
                    type: "post"
                },
                include: {
                    user: true
                },
                orderBy: {
                    children_comments: {
                        _count: "desc"
                    }
                }
            };
        }

        if (type === "komunitas") {
            query = {
                ...query,
                where: {
                    ...query.where,
                    type: "subreddit"
                },
                include: {
                    user: true,
                    children: {
                        where: {
                            status: "active"
                        }
                    }
                },
                orderBy: {
                    children: {
                        _count: "desc"
                    }
                }
            };
        }

        const result = await prisma.discussions_posts.findMany(query);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = { index };
