const { default: prisma } = require("../lib/prisma");

const index = async (req, res) => {
    const { id } = req?.query;

    try {
        const result = await prisma.users.findUnique({
            where: {
                custom_id: id
            }
        });
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    index
};
