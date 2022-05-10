import prisma from "../lib/prisma";

// this fucking downvote for everyone
const upvote = async (req, res) => {
    const { id } = req.query;
    const { customId } = req.user;

    try {
        const result = await prisma.discussions_votes.findUnique({
            where: {
                discussion_post_id_user_custom_id: {
                    discussion_post_id: id,
                    user_custom_id: customId
                }
            }
        });

        if (!result) {
            await prisma.discussions_votes.create({
                data: {
                    discussion_post_id: id,
                    user_custom_id: customId,
                    vlag: 1
                }
            });
        } else if (result?.vlag === 1) {
            await prisma.discussions_votes.delete({
                where: {
                    discussion_post_id_user_custom_id: {
                        discussion_post_id: id,
                        user_custom_id: customId
                    }
                }
            });
        } else {
            await prisma.discussions_votes.update({
                where: {
                    discussion_post_id_user_custom_id: {
                        discussion_post_id: id,
                        user_custom_id: customId
                    }
                },
                data: {
                    vlag: 1
                }
            });
        }

        const sum = await prisma.discussions_votes.aggregate({
            _sum: {
                vlag: true
            },
            where: {
                discussion_post_id: id
            }
        });

        const totalVotes = sum?._sum?.vlag === null ? 0 : sum?._sum?.vlag;

        await prisma.discussions_posts.update({
            where: {
                id
            },
            data: {
                votes: totalVotes
            }
        });

        const newData = await prisma.discussions_posts.findFirst({
            where: {
                id,
                status: "active",
                type: "post"
            },
            include: {
                parent: true,
                user: true,
                discussions_votes: {
                    where: {
                        user_custom_id: req?.user?.customId
                    }
                },
                _count: {
                    select: {
                        children_comments: true
                    }
                }
            }
        });

        res.json(newData);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const downvote = async (req, res) => {
    const { id } = req.query;
    const { customId } = req.user;
    try {
        const result = await prisma.discussions_votes.findUnique({
            where: {
                discussion_post_id_user_custom_id: {
                    discussion_post_id: id,
                    user_custom_id: customId
                }
            }
        });

        if (!result) {
            await prisma.discussions_votes.create({
                data: {
                    discussion_post_id: id,
                    user_custom_id: customId,
                    vlag: -1
                }
            });
        } else if (result?.vlag === -1) {
            await prisma.discussions_votes.delete({
                where: {
                    discussion_post_id_user_custom_id: {
                        discussion_post_id: id,
                        user_custom_id: customId
                    }
                }
            });
        } else {
            await prisma.discussions_votes.update({
                where: {
                    discussion_post_id_user_custom_id: {
                        discussion_post_id: id,
                        user_custom_id: customId
                    }
                },
                data: {
                    vlag: -1
                }
            });
        }

        const sum = await prisma.discussions_votes.aggregate({
            _sum: {
                vlag: true
            },
            where: {
                discussion_post_id: id
            }
        });

        const totalVotes = sum?._sum?.vlag === null ? 0 : sum?._sum?.vlag;

        await prisma.discussions_posts.update({
            where: {
                id
            },
            data: {
                votes: totalVotes
            }
        });

        const newData = await prisma.discussions_posts.findFirst({
            where: {
                id,
                status: "active",
                type: "post"
            },
            include: {
                parent: true,
                user: true,
                discussions_votes: {
                    where: {
                        user_custom_id: req?.user?.customId
                    }
                },
                _count: {
                    select: {
                        children_comments: true
                    }
                }
            }
        });

        res.json(newData);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    upvote,
    downvote
};
