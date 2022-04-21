const { default: prisma } = require("../lib/prisma");

const index = async (req, res) => {
    const { id } = req.query;
    const { customId } = req.user;
    try {
        const result = await prisma.tugas_tambahan.findMany({
            where: {
                penilaian_id: id,
                penilaian: {
                    user_custom_id: customId,
                    aktif: true
                }
            }
        });
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const create = async (req, res) => {
    // const { id } = req.query;
    // const { customId } = req.user;
    const { body } = req;

    try {
        await prisma.tugas_tambahan.create({
            data: body
        });
        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const update = async (req, res) => {
    const { tambahanId } = req.query;
    const { body } = req;
    try {
        await prisma.tugas_tambahan.update({
            where: {
                id: tambahanId
            },
            data: body
        });
        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const detail = async (req, res) => {
    const { tambahanId } = req.query;
    try {
        const result = await prisma.tugas_tambahan.findUnique({
            where: {
                id: tambahanId
            }
        });
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const remove = async (req, res) => {
    const { tambahanId } = req.query;
    try {
        await prisma.tugas_tambahan.delete({
            where: {
                id: tambahanId
            }
        });
        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    index,
    create,
    update,
    detail,
    remove
};
