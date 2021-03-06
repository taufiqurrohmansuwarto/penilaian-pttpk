import { responsiveMap } from "antd/lib/_util/responsiveObserve";
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

const subscribe = async (req, res) => {
    const { customId } = req.user;
    const { title } = req.query;

    try {
        const komunitas = await prisma.discussions_posts.findFirst({
            where: {
                title: {
                    contains: title,
                    mode: "unsensitive"
                }
            }
        });

        await prisma.discussions_posts_joined.create({
            data: {
                discussion_post_id: komunitas?.id,
                user_custom_id: customId
            }
        });

        res.json({ code: 200, message: "sukses" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const unsubscribe = async (req, res) => {
    const { customId } = req.user;
    const { title } = req.query;

    try {
        const komunitas = await prisma.discussions_posts.findFirst({
            where: {
                title: {
                    contains: title,
                    mode: "unsensitive"
                }
            }
        });

        await prisma.discussions_posts_joined.delete({
            where: {
                user_custom_id_discussion_post_id: {
                    discussion_post_id: komunitas?.id,
                    user_custom_id: customId
                }
            }
        });

        res.json({ code: 200, message: "sukses" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const subscribePost = async (req, res) => {
    const { customId } = req.user;
    const { id } = req.query;
    try {
        await prisma.discussions_posts_joined.create({
            data: {
                discussion_post_id: id,
                user_custom_id: customId
            }
        });
        res.json({ code: 200, message: "success" });
    } catch (e) {
        console.log(e);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const unsubscribePost = async (req, res) => {
    const { customId } = req.user;
    const { id } = req.query;
    try {
        await prisma.discussions_posts_joined.delete({
            where: {
                user_custom_id_discussion_post_id: {
                    discussion_post_id: id,
                    user_custom_id: customId
                }
            }
        });
        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const getSubscribesPosts = async (req, res) => {
    const { id } = req.query;
    const { customId } = req.user;
    try {
        const result = await prisma.discussions_posts_joined.findUnique({
            where: {
                user_custom_id_discussion_post_id: {
                    discussion_post_id: id,
                    user_custom_id: customId
                }
            }
        });
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

export default {
    unsubscribe,
    subscribe,
    getSubscribesPosts,
    unsubscribePost,
    subscribePost,
    listSubscribes
};
