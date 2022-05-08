// untuk keperluan email

const { default: prisma } = require("../lib/prisma");

const index = async (req, res) => {
    // should infinite scroll
    const { customId } = req?.user;

    try {
        const result = await prisma.users_messages_mapped.findMany({
            where: {
                user_custom_id: customId
            }
        });
        res.json(result);
    } catch (error) {
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const create = async (req, res) => {
    const { customId } = req?.user;
    try {
    } catch (error) {}
};

const detail = async (req, res) => {
    const { customId } = req?.user;
    try {
    } catch (error) {}
};

const update = async (req, res) => {
    const { customId } = req?.user;
    try {
    } catch (error) {}
};

const remove = async (req, res) => {
    const { customId } = req?.user;
    try {
    } catch (error) {}
};

module.exports = {
    index,
    create,
    detail,
    update,
    remove
};
