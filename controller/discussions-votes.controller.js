import prisma from "../lib/prisma";

const upvote = async (req, res) => {
    const { id } = req.query;
    const { customId } = req.user;
    try {
    } catch (error) {}
};

const downvote = async (req, res) => {
    const { id } = req.query;
    const { customId } = req.user;
    try {
    } catch (error) {
        res.status(400).json({ code: 4 });
    }
};

module.exports = {
    upvote,
    downvote
};
