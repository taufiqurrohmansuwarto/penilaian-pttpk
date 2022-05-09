import prisma from "../lib/prisma";

const requestDownvote = async (id, userCustomid) => {
    return await prisma.$transaction(async (prisma) => {
        const vlag = await prisma.discussions_votes.findUnique({
            where: {
                discussion_post_id_user_custom_id: {
                    discussion_post_id: id,
                    user_custom_id: userCustomid
                }
            }
        });

        let myVlag;
        if (vlag === null) {
            myVlag = -1;
        } else if (vlag?.vlag === 1 || vlag?.vlag === -1) {
            myVlag = 0;
        } else if (vlag?.vlag === 0) {
            myVlag = -1;
        }

        const upsert = await prisma.discussions_votes.upsert({
            create: {
                discussion_post_id: id,
                user_custom_id: userCustomid,
                vlag: -1
            },
            update: {
                vlag: myVlag
            },
            where: {
                discussion_post_id_user_custom_id: {
                    discussion_post_id: id,
                    user_custom_id: userCustomid
                }
            }
        });

        const hasil = await prisma.discussions_posts.findUnique({
            where: {
                id
            },
            select: {
                votes: true
            }
        });

        const currentFlag = upsert?.vlag;
        if (currentFlag === 0 && hasil?.votes <= 0) {
            await prisma.discussions_posts.update({
                data: {
                    votes: {
                        increment: 1
                    }
                },
                where: { id }
            });
        } else if (currentFlag === 0 && hasil?.votes >= 0) {
            await prisma.discussions_posts.update({
                data: {
                    votes: {
                        decrement: 1
                    }
                },
                where: { id }
            });
        } else if (currentFlag === -1) {
            await prisma.discussions_posts.update({
                data: {
                    votes: {
                        decrement: 1
                    }
                },
                where: { id }
            });
        }
    });
};

const requestUpvote = async (id, userCustomid) => {
    return await prisma.$transaction(async (prisma) => {
        // find first with many to many
        const vlag = await prisma.discussions_votes.findUnique({
            where: {
                discussion_post_id_user_custom_id: {
                    discussion_post_id: id,
                    user_custom_id: userCustomid
                }
            }
        });

        let myVlag;
        if (vlag === null) {
            myVlag = 1;
        } else if (vlag?.vlag === 0) {
            myVlag = 1;
        } else if (vlag?.vlag === 1 || vlag?.vlag === -1) {
            myVlag = 0;
        }

        const upsert = await prisma.discussions_votes.upsert({
            create: {
                discussion_post_id: id,
                user_custom_id: userCustomid,
                vlag: 1
            },
            update: {
                vlag: myVlag
            },
            where: {
                discussion_post_id_user_custom_id: {
                    discussion_post_id: id,
                    user_custom_id: userCustomid
                }
            }
        });

        const hasil = await prisma.discussions_posts.findUnique({
            where: {
                id
            },
            select: {
                votes: true
            }
        });

        const currentFlag = upsert?.vlag;
        if (currentFlag === 0 && hasil?.votes <= 0) {
            await prisma.discussions_posts.update({
                data: {
                    votes: {
                        increment: 1
                    }
                },
                where: { id }
            });
        } else if (currentFlag === 0 && hasil?.votes >= 0) {
            await prisma.discussions_posts.update({
                data: {
                    votes: {
                        decrement: 1
                    }
                },
                where: { id }
            });
        } else if (currentFlag === 1) {
            await prisma.discussions_posts.update({
                data: {
                    votes: {
                        increment: 1
                    }
                },
                where: { id }
            });
        }
    });
};

const upvote = async (req, res) => {
    const { id } = req.query;
    const { customId } = req.user;

    try {
        // await requestUpvote(id, customId, vlag);

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

        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const downvote = async (req, res) => {
    const { id } = req.query;
    const { customId } = req.user;
    try {
        // await requestDownvote(id, customId, vlag);

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

        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    upvote,
    downvote
};
