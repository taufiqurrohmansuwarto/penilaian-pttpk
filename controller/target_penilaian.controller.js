import prisma from "../lib/prisma";

const index = async (req, res) => {
    const { id } = req.query;
    const { customId } = req.user;

    try {
        const result = await prisma.target_penilaian.findMany({
            where: {
                id_penilaian: id,
                penilaian: {
                    user_custom_id: customId
                }
            },
            include: {
                ref_satuan_kinerja: true
            },
            orderBy: {
                created_at: "asc"
            }
        });
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({ code: 400 });
    }
};

const detail = async (req, res) => {
    const { id } = req.query;
    const { customId } = req.user;
    try {
        const result = prisma.target_penilaian.findFirst({
            where: {
                id_penilaian: id,
                penilaian: {
                    user_custom_id: customId
                }
            }
        });
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

const create = async (req, res) => {
    const { id } = req.query;
    const { customId } = req.user;
    const { body } = req;
    const data = { ...body, id_penilaian: id };

    try {
        // check the first

        const result = await prisma.penilaian.findUnique({
            where: {
                id
            }
        });

        if (!result || result?.user_custom_id !== customId) {
            res.status(404).json({
                code: 404,
                message:
                    "Tidak ada penilaian atau penilaian itu bukan milik anda"
            });
        } else {
            await prisma.target_penilaian.create({
                data: {
                    kuantitas: data?.kuantitas,
                    pekerjaan: data?.pekerjaan,
                    ref_satuan_kinerja: {
                        connect: {
                            id: parseInt(data?.ref_satuan_kinerja_id)
                        }
                    },
                    penilaian: {
                        connect: {
                            id
                        }
                    }
                }
            });
            res.json({ code: 200, message: "success" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Errror" });
    }
};

const update = async (req, res) => {
    const { id, targetId } = req.query;
    const { customId } = req.user;
    const { body } = req;
    const data = { ...body };

    try {
        await prisma.target_penilaian.updateMany({
            data,
            where: {
                id: targetId,
                penilaian: {
                    id,
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

const remove = async (req, res) => {
    const { id, targetId } = req.query;
    const { customId } = req.user;

    try {
        await prisma.target_penilaian.deleteMany({
            where: {
                id: targetId,
                penilaian: {
                    user_custom_id: customId,
                    id
                }
            }
        });

        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

export default {
    index,
    detail,
    create,
    update,
    remove
};
