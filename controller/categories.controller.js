const { default: prisma } = require("../lib/prisma");

// its fucking subreddits
const index = async (req, res) => {
    const { userId } = req.user;
    try {
        const result = await prisma.discussions_posts.findMany({
            where: { parent_id: null, type: "subreddit" }
        });
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

const create = async (req, res) => {
    const { customId, name, image } = req.user;

    const { title, link, content } = req?.body;

    const data = {
        parent_id: null,
        type: "subreddit",
        title,
        link,
        content,
        status: "active",
        user_custom_id: customId,
        username: name,
        avatar: image
    };

    try {
        await prisma.discussions_posts.create({
            data
        });

        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

const detail = async (req, res) => {
    try {
    } catch (error) {}
};

// just non active / archived this sub reddits
const remove = async (req, res) => {
    try {
    } catch (error) {
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

const update = async (req, res) => {
    try {
    } catch (error) {
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    index,
    create,
    detail,
    remove,
    update
};
