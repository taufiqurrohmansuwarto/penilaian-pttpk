const { default: prisma } = require("../lib/prisma");

const index = async (req, res) => {
    try {
        const result = await prisma.topics.findMany();
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

const create = async (req, res) => {
    try {
        res.json({ code: 200, message: "success" });
    } catch (error) {
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    index,
    create
};
