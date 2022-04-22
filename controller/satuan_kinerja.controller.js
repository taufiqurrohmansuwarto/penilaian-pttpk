import prisma from "../lib/prisma";

const index = async (req, res) => {
    try {
        const result = await prisma.ref_satuan_kinerja.findMany({
            orderBy: {
                created_at: "desc"
            }
        });
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const get = async (req, res) => {
    try {
        const { id } = req.query;
        const result = await prisma.ref_satuan_kinerja.findFirst({
            where: {
                id
            }
        });
        res.json(result);
    } catch (error) {
        console.log(error);
    }
};

const create = async (req, res) => {
    try {
        const { body } = req;
        await prisma.ref_satuan_kinerja.createMany({
            data: body
        });
        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.query;
        const { body } = req;

        await prisma.ref_satuan_kinerja.update({
            data: body,
            where: {
                id: parseInt(id)
            }
        });
        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.query;
        await prisma.ref_satuan_kinerja.delete({
            where: {
                id
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
    get,
    remove,
    update,
    create
};
