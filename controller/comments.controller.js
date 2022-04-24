import prisma from "../lib/prisma";

const index = async (req, res) => {
    const { customId } = req.user;
    const cursor = req?.query?.cursor;
    const sort = req?.query?.sort || "terbaru";

    const take = 50;

    let query = {
        take,
        where: {
            parent_id: null
        },
        include: {
            comments_likes: {
                include: {
                    users: {
                        select: {
                            username: true
                        }
                    }
                }
            },
            user: true,
            children: {
                orderBy: {
                    created_at: "asc"
                },
                include: {
                    user: true
                }
            }
        }
    };

    // pretty wrong btw
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

    if (sort === "me") {
        query = {
            ...query,
            where: {
                ...query?.where,
                user_custom_id: customId,
                parent_id: null
            },
            orderBy: {
                created_at: "desc"
            }
        };
    }

    if (sort === "terbaru") {
        query = {
            ...query,
            orderBy: {
                created_at: "desc"
            }
        };
    }

    if (sort === "like") {
        query = {
            ...query,
            orderBy: {
                likes: "desc"
            }
        };
    }

    if (sort === "popular") {
        query = {
            ...query,
            orderBy: {
                children: {
                    _count: "desc"
                }
            }
        };
    }

    try {
        // todo paging or infinte scroll
        const result = await prisma.comments.findMany({
            ...query
        });

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

// detail comments
const get = async (req, res) => {
    const { commentId } = req.query;
    try {
        const result = await prisma.comments.findMany({
            where: {
                id: commentId
            },
            include: {
                children: true
            }
        });

        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const create = async (req, res) => {
    const { body } = req;
    const { customId } = req.user;

    try {
        const data = {
            user_custom_id: customId,
            comment: body?.comment,
            parent_id: body?.parent_id
        };

        const result = await prisma.comments.create({
            data
        });

        if (body?.parent_id !== null) {
            //
            const result = await prisma.comments.findUnique({
                where: {
                    id: body?.parent_id
                }
            });

            // kalau sama dengan user jangan dikiri
            if (customId !== result?.user_custom_id) {
                await prisma.comments_notifications.create({
                    data: {
                        comment_id: body?.parent_id,
                        sender: customId,
                        receiver: result?.user_custom_id,
                        type: "replied",
                        message: body?.comment
                    }
                });
            }
        }

        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

// const for likes
const update = async (req, res) => {
    const { commentId } = req.query;
    const { customId } = req.user;
    const { comment } = req?.body;
    try {
        await prisma.comments.updateMany({
            where: {
                id: commentId,
                user_custom_id: customId
            },
            data: {
                comment,
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
    const { commentId } = req.query;
    const { customId } = req.user;
    try {
        await prisma.comments.deleteMany({
            where: {
                user_custom_id: customId,
                id: commentId
            }
        });
        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const likes = async (req, res) => {
    const { customId } = req.user;
    const { commentId } = req.query;
    const { value } = req.body;

    try {
        const upsert = await prisma.comments_likes.upsert({
            create: {
                user_custom_id: customId,
                comment_id: commentId,
                value: 1
            },
            update: {
                value: value === 1 ? 0 : 1
            },
            where: {
                comment_id_user_custom_id: {
                    comment_id: commentId,
                    user_custom_id: customId
                }
            }
        });

        const hasil = await prisma.comments.findUnique({
            where: {
                id: commentId
            },
            select: {
                dislikes: true
            }
        });

        const flag = upsert?.value === 1 ? "increment" : "decrement";

        await prisma.comments.update({
            where: {
                id: commentId
            },
            data: {
                likes: {
                    [flag]: 1
                },
                dislikes: {
                    decrement:
                        upsert?.value === 1 && hasil?.dislikes > 0 ? 1 : 0
                }
            }
        });

        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

const dislikes = async (req, res) => {
    const { customId } = req.user;
    const { commentId } = req.query;
    const { value } = req.body;

    try {
        const upsert = await prisma.comments_likes.upsert({
            create: {
                user_custom_id: customId,
                comment_id: commentId,
                value: -1
            },
            update: {
                value: value === -1 ? 0 : -1
            },
            where: {
                comment_id_user_custom_id: {
                    comment_id: commentId,
                    user_custom_id: customId
                }
            }
        });

        const hasil = await prisma.comments.findUnique({
            where: {
                id: commentId
            },
            select: {
                likes: true
            }
        });

        const flag = upsert?.value === -1 ? "increment" : "decrement";

        await prisma.comments.update({
            where: {
                id: commentId
            },
            data: {
                dislikes: {
                    [flag]: 1
                },
                likes: {
                    decrement: upsert?.value === -1 && hasil?.likes > 0 ? 1 : 0
                }
            }
        });

        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

export default {
    index,
    get,
    create,
    update,
    remove,
    likes,
    dislikes
};
