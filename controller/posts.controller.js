const { default: prisma } = require("../lib/prisma");

const serialize = (data, arrSum) => {
    const id = data?.id;
    const result = arrSum?.find((arr) => arr?.discussion_post_id === id);

    return {
        ...data,
        votes: result ? result?._sum?.vlag : 0
    };
};

const serializeData = (data, arrSum) => {
    return data?.map((d) => serialize(d, arrSum));
};

const index = async (req, res) => {
    // should be there sort
    const sort = req.query?.sort || "terbaru";
    const cursor = req.query?.cursor;
    const take = 50;

    let query = {
        take,
        where: {
            type: "post",
            status: "active"
        },
        include: {
            parent: true,
            user: true,
            discussions_votes: true,
            _count: {
                select: {
                    children_comments: true
                }
            }
        }
    };

    if (sort === "terbaru") {
        query = { ...query, orderBy: { created_at: "desc" } };
    }

    if (req?.query?.userId) {
        query = {
            ...query,
            where: {
                ...query?.where,
                user_custom_id: req?.query?.userId
            }
        };
    }

    if (sort === "vote") {
        query = { ...query, orderBy: { votes: "desc" } };
    }

    if (sort === "populer") {
        query = {
            ...query,
            orderBy: {
                children_comments: {
                    _count: "desc"
                }
            }
        };
    }

    // if therewas an cursor
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

    try {
        const result = await prisma.discussions_posts.findMany(query);

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
