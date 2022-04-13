import prisma from "../lib/prisma";

const requestUpvote = async (id, userCustomid, vlag) => {
    return await prisma.$transaction(async (prisma) => {
        const upsert = await prisma.discussions_votes.upsert({
            create: {
                discussion_post_id: id,
                user_custom_id: userCustomid,
                vlag: 1
            },
            update: {
                vlag: vlag === 1 ? 0 : 1
            },
            where: {
                discussion_post_id: id,
                user_custom_id: userCustomid
            }
        });

        const hasil = await prisma.discussions_posts.findUnique({
            where: {
                id
            },
            select: {
                downvotes: true
            }
        });

        const vlag = upsert?.vlag === 1 ? "increment" : "decrement";

        const result = await prisma.discussions_posts.update({
            where: {
                id
            },
            data: {
                votes: {
                    [vlag]: 1
                },
                downvotes: {
                    decrement:
                        upsert?.value === 1 && hasil?.downvotes > 0 ? 1 : 0
                }
            }
        });

        return result;
    });
};

// todo implement upvote
const upvote = async (req, res) => {
    const { id } = req.query;
    const { customId } = req.user;
    try {
        // samakan
    } catch (error) {
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const downvote = async (req, res) => {
    const { id } = req.query;
    const { customId } = req.user;
    try {
        // samakan
    } catch (error) {
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    upvote,
    downvote
};
