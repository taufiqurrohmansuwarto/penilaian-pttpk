const { default: prisma } = require("../lib/prisma");

const index = async (req, res) => {
    let query = {
        include: {
            comment: {
                include: {
                    parent: true
                }
            },
            discussion: {
                include: {
                    parent: true,
                    parent_comments: true
                }
            },
            receiver: {
                select: {
                    custom_id: true,
                    username: true,
                    image: true
                }
            },
            sender: {
                select: {
                    custom_id: true,
                    username: true,
                    image: true
                }
            }
        },
        orderBy: {
            created_at: "desc"
        }
    };

    try {
        const cursor = req?.query?.cursor;
        const take = 50;

        if (cursor && cursor !== 0 && cursor !== "0") {
            query = {
                ...query,
                take,
                skip: 1,
                cursor: {
                    id: cursor
                }
            };
        }

        const result = await prisma.user_activities.findMany(query);

        const nextCursor =
            result?.length < take
                ? null
                : result[result?.length - 1]?.id || null;

        res.json({ data: result, nextCursor });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    index
};
