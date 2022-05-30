const { default: prisma } = require("../lib/prisma");

const index = async (req, res) => {
    try {
        const result = await prisma.groups_chats.findMany();
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    index
};
