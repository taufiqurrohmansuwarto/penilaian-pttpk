import { uniq } from "lodash";
import prisma from "../lib/prisma";
import { parse } from "node-html-parser";

const serialize = (result) => {
    if (!result?.length) {
        return [];
    } else {
        return result?.map((d) => {
            let currentComment;
            const currentRoot = parse(d?.comment);

            if (!currentRoot?.querySelector("img")) {
                currentComment = d?.comment;
            } else {
                currentRoot?.querySelectorAll("img").forEach((d) => {
                    d.setAttribute(
                        "style",
                        `width: auto;max-width: 200px;max-height: 200px;height:auto;`
                    );
                });

                currentComment = currentRoot?.toString();
            }

            return {
                ...d,
                comment: currentComment
            };
        });
    }
};

const index = async (req, res) => {
    const { customId } = req.user;
    const cursor = req?.query?.cursor;
    const sort = req?.query?.sort || "terbaru";

    const take = 50;

    let query = {
        take,
        where: {
            parent_id: null,
            is_deleted: null
        },
        include: {
            user: true,
            children: {
                where: {
                    is_deleted: null
                }
            },
            comments_likes: {
                where: {
                    user_custom_id: customId
                }
            },
            _count: {
                select: {
                    comments_likes: true
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
                comments_likes: {
                    _count: "desc"
                }
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

        const data = serialize(result);
        const id = data?.map((d) => d?.id);

        // get the count cause prisma cant do count with where
        const allCount = await Promise.all(
            id?.map(async (x) => {
                return await prisma.comments.count({
                    where: {
                        parent_id: x,
                        is_deleted: null
                    }
                });
            })
        );

        const newData = data?.map((d, i) => ({
            ...d,
            _count: {
                ...d?._count,
                children: allCount[i]
            }
        }));

        res.json({ data: newData, nextCursor });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

// detail comments
const get = async (req, res) => {
    const { commentId } = req.query;
    const { customId } = req?.user;

    try {
        const result = await prisma.comments.findFirst({
            where: {
                id: commentId,
                is_deleted: null
            },
            include: {
                user: true,
                comments_likes: {
                    where: {
                        user_custom_id: customId
                    }
                },
                children: {
                    orderBy: {
                        created_at: "asc"
                    },
                    where: {
                        is_deleted: null
                    },
                    include: {
                        user: true
                    }
                },
                _count: {
                    select: {
                        comments_likes: true
                    }
                }
            }
        });

        const childrenCount = await prisma.comments.count({
            where: {
                parent_id: commentId,
                is_deleted: null
            }
        });

        res.json({
            ...result,
            _count: { ...result?._count, children: childrenCount }
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const create = async (req, res) => {
    const { body } = req;
    const { customId } = req.user;

    let comment;
    const root = parse(body?.comment);
    const currentRoot = parse(body?.comment);

    if (!currentRoot?.querySelector("img")) {
        comment = body?.comment;
    } else {
        currentRoot?.querySelectorAll("img").forEach((d) => {
            d.setAttribute(
                "style",
                `width: auto;max-width: 200px;max-height: 200px;height:auto;`
            );
        });

        comment = currentRoot?.toString();
    }

    try {
        const data = {
            user_custom_id: customId,
            comment,
            parent_id: body?.parent_id
        };

        const selectorMention = root
            ?.querySelectorAll("span.mention")
            ?.map((h) => h?._rawAttrs);

        let list = [];

        if (selectorMention?.length !== 0) {
            list = selectorMention
                ?.map((s) => s["data-id"])
                ?.filter((x) => x !== customId);
        }

        const listMention = uniq(list);

        const result = await prisma.comments.create({
            data
        });

        if (body?.parent_id !== null) {
            //
            const result = await prisma.comments.findUnique({
                where: {
                    id: body?.parent_id
                },
                include: {
                    children: true
                }
            });

            // kalau sama dengan user jangan dikiri
            // harus ada notifikasi di user lain yang berkomentar di chilren
            if (customId !== result?.user_custom_id) {
                const comment_owner = result?.user_custom_id;
                const commentator = req.user?.customId;

                await prisma.comments_notifications.create({
                    data: {
                        comment_id: body?.parent_id,
                        sender: customId,
                        receiver: result?.user_custom_id,
                        type: "replied"
                    }
                });

                if (result?.children?.length !== 0) {
                    const usersSender = result?.children
                        .map((b) => b?.user_custom_id)
                        ?.filter(
                            (x) => x !== comment_owner && x !== commentator
                        );

                    const data = uniq(usersSender)?.map((user) => ({
                        comment_id: body?.parent_id,
                        sender: customId,
                        receiver: user,
                        type: "replied-comment"
                    }));

                    if (listMention?.length !== 0) {
                        const data = listMention?.map((l) => ({
                            comment_id: body?.parent_id,
                            sender: customId,
                            receiver: l,
                            type: "mention"
                        }));

                        await prisma.comments_notifications.createMany({
                            data
                        });
                    }

                    await prisma.comments_notifications.createMany({
                        data
                    });
                }
            } else {
                if (result?.children?.length !== -1) {
                    const comment_owner = result?.user_custom_id;
                    const commentator = req.user?.customId;

                    const usersSender = result?.children
                        .map((b) => b?.user_custom_id)
                        ?.filter(
                            (x) => x !== comment_owner && x !== commentator
                        );

                    const data = uniq(usersSender)?.map((user) => ({
                        comment_id: body?.parent_id,
                        sender: customId,
                        receiver: user,
                        type: "replied-comment"
                    }));

                    if (listMention?.length !== -1) {
                        const data = listMention?.map((l) => ({
                            comment_id: body?.parent_id,
                            sender: customId,
                            receiver: l,
                            type: "mention"
                        }));

                        await prisma.comments_notifications.createMany({
                            data
                        });
                    }

                    await prisma.comments_notifications.createMany({
                        data
                    });
                }
            }
        } else {
            // fuck you ngentod
            if (listMention?.length !== 0) {
                const data = listMention?.map((l) => ({
                    comment_id: result?.id,
                    sender: customId,
                    receiver: l,
                    type: "mention"
                }));

                await prisma.comments_notifications.createMany({
                    data
                });
            }
        }

        // get the last fucking id
        const hasil = await prisma.comments.findUnique({
            where: {
                id: result?.id
            },
            include: {
                user: true,
                comments_likes: {
                    where: {
                        user_custom_id: customId
                    }
                },
                _count: {
                    select: {
                        children: true,
                        comments_likes: true
                    }
                }
            }
        });

        res.json(hasil);
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

    let currentComment;
    const currentRoot = parse(comment);

    if (!currentRoot?.querySelector("img")) {
        currentComment = comment;
    } else {
        currentRoot?.querySelectorAll("img").forEach((d) => {
            d.setAttribute(
                "style",
                `width: auto;max-width: 200px;max-height: 200px;height:auto;`
            );
        });

        currentComment = currentRoot?.toString();
    }

    try {
        await prisma.comments.updateMany({
            where: {
                id: commentId,
                user_custom_id: customId
            },
            data: {
                comment: currentComment,
                is_edited: true,
                updated_at: new Date()
            }
        });

        const root = parse(comment);
        const selectorMention = root
            ?.querySelectorAll("span.mention")
            ?.map((h) => h?._rawAttrs);

        let list = [];

        if (selectorMention?.length !== 0) {
            list = selectorMention
                ?.map((s) => s["data-id"])
                ?.filter((x) => x !== customId);
        }

        const listMention = uniq(list);
        const hasil = await prisma.comments.findFirst({
            where: {
                id: commentId
            }
        });

        if (hasil?.parent_id === null) {
            if (listMention?.length !== 0) {
                const data = listMention?.map((l) => ({
                    comment_id: hasil?.id,
                    sender: customId,
                    receiver: l,
                    type: "mention"
                }));

                await prisma.comments_notifications?.createMany({
                    data
                });
            }
        } else {
            if (listMention?.length !== 0) {
                const data = listMention?.map((l) => ({
                    comment_id: hasil?.parent_id,
                    sender: customId,
                    receiver: l,
                    type: "mention"
                }));

                await prisma.comments_notifications?.createMany({
                    data
                });
            }
        }

        const result = await prisma.comments.findUnique({
            where: {
                id: commentId
            },
            include: {
                user: true,
                comments_likes: {
                    where: {
                        user_custom_id: customId
                    }
                },
                children: {
                    orderBy: {
                        created_at: "asc"
                    },
                    where: {
                        is_deleted: null
                    },
                    include: {
                        user: true
                    }
                },
                _count: {
                    select: {
                        comments_likes: true
                    }
                }
            }
        });

        const childrenCount = await prisma.comments.count({
            where: {
                parent_id: commentId,
                is_deleted: null
            }
        });

        res.json({
            ...result,
            _count: { ...result?._count, children: childrenCount }
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const remove = async (req, res) => {
    const { commentId } = req.query;
    const { customId } = req.user;
    try {
        await prisma.comments.updateMany({
            where: {
                id: commentId,
                user_custom_id: customId,
                is_deleted: null
            },
            data: {
                is_deleted: new Date()
            }
        });
        res.json(commentId);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const likes = async (req, res) => {
    const { customId } = req.user;
    const { commentId } = req.query;

    try {
        const result = await prisma.comments_likes.findUnique({
            where: {
                comment_id_user_custom_id: {
                    comment_id: commentId,
                    user_custom_id: customId
                }
            }
        });

        if (!result) {
            await prisma.comments_likes.create({
                data: {
                    user_custom_id: customId,
                    comment_id: commentId
                }
            });

            const result = await prisma.comments.findUnique({
                where: {
                    id: commentId
                },
                include: {
                    user: true,
                    comments_likes: {
                        where: {
                            user_custom_id: customId
                        }
                    },
                    _count: {
                        select: {
                            children: true,
                            comments_likes: true
                        }
                    }
                }
            });
            res.json(result);
        } else {
            await prisma.comments_likes.delete({
                where: {
                    comment_id_user_custom_id: {
                        comment_id: commentId,
                        user_custom_id: customId
                    }
                }
            });

            const result = await prisma.comments.findUnique({
                where: {
                    id: commentId
                },
                include: {
                    user: true,
                    comments_likes: {
                        where: {
                            user_custom_id: customId
                        }
                    },
                    _count: {
                        select: {
                            children: true,
                            comments_likes: true
                        }
                    }
                }
            });
            res.json(result);
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
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
