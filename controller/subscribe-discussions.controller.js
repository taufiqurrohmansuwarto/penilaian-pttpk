import prisma from "../lib/prisma";

const listSubscribes = async (req, res) => {
    const { customId } = req.user;

    try {
        const result = await prisma.discussions_posts_joined.findMany({
            where: {
                user_custom_id: customId,
                discussion: {
                    type: "subreddit"
                }
            },
            include: {
                discussion: true
            }
        });

        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const subscribe = async (req, res) => {};

const unsubscribe = async (req, res) => {};

module.exports = {
    listSubscribes,
    subscribe,
    unsubscribe
};
