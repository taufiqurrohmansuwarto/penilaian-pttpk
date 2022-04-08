import prisma from "../lib/prisma";
const arrayToTree = require("array-to-tree");

const index = async (req, res) => {
    const { customId } = req?.user;
    const cursor = req?.query?.cursor;

    const take = 10;
    let query = {
        take,

        include: {
            comments_likes: true,
            user: true,
            children: {
                orderBy: {
                    created_at: "asc"
                },
                include: {
                    user: true
                }
            }
        },
        orderBy: [
            {
                created_at: "desc"
            },
            {
                children: {
                    _count: "desc"
                }
            }
        ]
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

    try {
        // todo paging or infinte scroll
        const result = await prisma.comments.findMany({
            ...query,
            where: {
                parent_id: null
            }
        });

        const newResult = arrayToTree(result, {
            customID: "id",
            parentProperty: "parent_id"
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
const get = async (req, res) => {};

const create = async (req, res) => {
    const { body } = req;
    const { customId, name: nama, userType, image } = req.user;

    try {
        const data = {
            nama,
            user_custom_id: customId,
            comment: body?.comment,
            parent_id: body?.parent_id
        };

        const result = await prisma.comments.create({
            data
        });
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

// const for likes
const update = async (req, res) => {
    const { userId, name } = req.user;
    const data = {
        user_custom_id: userId,
        user_name: name,
        comment_id: req?.query?.commentId
    };

    try {
        await prisma.comments_likes.upsert({
            where: {
                comment_id: data?.comment_id,
                user_custom_id: data?.user_custom_id
            },
            create: {
                comment_id: data?.comment_id,
                user_custom_id: data?.user_custom_id,
                user_name: data?.user_name
            },
            update: {}
        });
    } catch (error) {}
};

const remove = async (req, res) => {
    const { userId } = req.user;
    try {
    } catch (error) {}
};

const likes = async (req, res) => {
    const { userId, customId, name, image } = req.user;
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
