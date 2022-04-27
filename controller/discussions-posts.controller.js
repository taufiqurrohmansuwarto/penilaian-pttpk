const { default: prisma } = require("../lib/prisma");
const index = async (req, res) => {
    const { id } = req.query;
    const sort = req?.query?.sort || "terbaru";
    const cursor = req?.query?.cursor;
    const take = 50;

    try {
        const community = await prisma.discussions_posts.findFirst({
            where: {
                title: id
            }
        });

        let query = {
            where: {
                parent_id: community?.id,
                status: "active",
                type: "post"
            },
            include: {
                _count: {
                    select: {
                        children_comments: true
                    }
                },
                user: true,
                parent: true,
                discussions_votes: true
            }
        };

        if (sort === "terbaru") {
            query = { ...query, orderBy: { created_at: "desc" } };
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

// ini harus general
const update = async (req, res) => {
    const { customId } = req.user;
    const { id } = req.query;
    const body = req?.body;
    // title, content
    try {
        const result = await prisma.discussions_posts.updateMany({
            where: {
                id,
                user_custom_id: customId,
                status: "active"
            },
            data: {
                ...body,
                is_edited: true,
                updated_at: new Date()
            }
        });

        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};
const remove = async (req, res) => {
    const { customId } = req.user;
    const { id } = req.query;
    // title, content
    try {
        await prisma.discussions_posts.updateMany({
            where: {
                id,
                user_custom_id: customId,
                status: "active"
            },
            data: {
                content: "<i>pesan telah dihapus</i>",
                updated_at: new Date()
            }
        });
        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const removePostPersonal = async (req, res) => {
    const { customId } = req.user;
    const { id } = req.query;

    try {
        await prisma.discussions_posts.updateMany({
            where: {
                id,
                user_custom_id: customId,
                status: "active",
                type: "post"
            },
            data: {
                status: "nonactive",
                deleted_at: new Date()
            }
        });
        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const updatePostPersonal = async (req, res) => {
    const { customId } = req.user;
    const { id } = req.query;

    try {
        await prisma.discussions_posts.updateMany({
            where: {
                id,
                user_custom_id: customId,
                status: "active",
                type: "post"
            },
            data: {
                ...req?.body,
                updated_at: new Date(),
                is_edited: true
            }
        });
        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(erorr);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const detail = async (req, res) => {
    const { id } = req.query;

    try {
        const result = await prisma.discussions_posts.findUnique({
            where: {
                id
            },
            include: {
                user: true,
                parent: {
                    include: {
                        _count: {
                            select: {
                                discussions_posts_joined: true
                            }
                        }
                    }
                },
                discussions_votes: true,
                _count: {
                    select: {
                        children_comments: true
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

module.exports = {
    index,
    create,
    update,
    remove,
    detail,
    updatePostPersonal,
    removePostPersonal
};
