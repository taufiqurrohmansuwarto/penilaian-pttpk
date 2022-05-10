const { default: prisma } = require("../lib/prisma");
const arrayToTree = require("array-to-tree");
const flatten = require("../utils/flatten-tree");
const rootParent = require("../utils/check-parent");
const { createActivity } = require("../utils/user-activity");

const index = async (req, res) => {
    const { id } = req.query;

    let query = {
        where: {
            post_id: id,
            type: "comment",
            status: "active"
        },
        include: {
            user: true,
            parent_comments: {
                select: {
                    user_custom_id: true
                }
            }
        },
        orderBy: {
            created_at: "desc"
        }
    };

    try {
        const result = await prisma.discussions_posts.findMany(query);

        const user = await prisma.discussions_posts.findMany({
            distinct: ["user_custom_id"],
            where: {
                post_id: id,
                type: "comment",
                status: "active"
            },
            select: {
                user: {
                    select: {
                        username: true,
                        custom_id: true,
                        image: true
                    }
                }
            }
        });

        const hasil = arrayToTree(result);
        if (req?.query?.target === "undefined" || !req?.query?.target) {
            res.json({ result: hasil, participants: user });
        } else {
            const myHasil = flatten(hasil, "children");
            const root = rootParent(req?.query?.target, myHasil);
            const currentHasil = hasil?.filter((h) => h?.id === root);
            res.json({ result: currentHasil, participants: user });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const detail = async (req, res) => {
    try {
    } catch (error) {
        console.log(error);
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

const create = async (req, res) => {
    const { customId } = req.user;
    const { body } = req;
    const { id } = req.query;

    try {
        const hasil = await prisma.discussions_posts.create({
            data: {
                parent_id: body?.parent_id,
                content: body?.comment,
                post_id: id,
                status: "active",
                type: "comment",
                user_custom_id: customId
            }
        });

        const result = await prisma.discussions_subscribes.findMany({
            where: {
                discussion_post_id: id,
                NOT: {
                    user_custom_id: customId
                }
            },
            select: {
                user_custom_id: true
            }
        });

        const senderId = req?.user?.customId;

        if (result?.length !== 0) {
            const data = result?.map((x) => ({
                sender: senderId,
                receiver: x?.user_custom_id,
                discussion_post_id: hasil?.id
            }));

            await prisma.discussions_notifications.createMany({
                data
            });
        }

        // cari hasil dari create
        const hasilKu = await prisma.discussions_posts.findUnique({
            where: {
                id: hasil?.id
            },
            include: {
                parent: {
                    include: {
                        user: true
                    }
                }
            }
        });

        if (hasilKu.parent.type === "post") {
            await createActivity("komentarDiskusiBaru", hasilKu.id, customId);
        } else if (hasilKu.parent.type === "comment") {
            await createActivity(
                "balasanKomentarDiskusi",
                hasilKu.id,
                customId,
                hasilKu.parent.user_custom_id
            );
        }

        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const update = async (req, res) => {
    try {
    } catch (error) {
        console.log(error);
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

const remove = async (req, res) => {
    try {
    } catch (error) {
        console.log(error);
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    index,
    detail,
    create,
    update,
    remove
};
