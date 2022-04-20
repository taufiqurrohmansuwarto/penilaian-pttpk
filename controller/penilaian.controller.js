import prisma from "../lib/prisma";

const index = async (req, res) => {
    try {
        const { customId } = req.user;

        if (req?.query?.aktif === "true") {
            const result = await prisma.penilaian.findFirst({
                where: {
                    user_custom_id: customId,
                    aktif: true
                }
            });
            res.json(result);
        } else {
            const result = await prisma.penilaian.findMany({
                where: {
                    user_custom_id: customId
                },
                orderBy: {
                    tahun: "desc"
                }
            });
            res.json(result);
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const get = async (req, res) => {
    const { id } = req.query;
    const { customId } = req.user;
    try {
        const result = await prisma.penilaian.findFirst({
            where: {
                id,
                user_custom_id: customId
            },
            include: {
                acc_kinerja_bulanan: true,
                kinerja_bulanan: true,
                target_penilaian: true
            }
        });
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const create = async (req, res) => {
    try {
        const { body } = req;
        const { customId } = req.user;
        const data = { ...body, user_custom_id: customId };

        await prisma.penilaian.create({
            data
        });

        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const update = async (req, res) => {
    const { customId } = req.user;
    const { id } = req.query;
    const { body, fetcher } = req;
    const skpd_id = parseInt(body?.id_skpd);
    // fetch to pemprov api

    const perangkatDaerah = await fetcher.get(
        `/pttpk/unor/${skpd_id}?type=text`
    );
    const perangkatDaerahJson = perangkatDaerah?.data?.data;
    const data = { ...body, skpd: perangkatDaerahJson };

    try {
        await prisma.penilaian.updateMany({
            where: {
                id,
                user_custom_id: customId
            },
            data: {
                ...data,
                updated_at: new Date()
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
        const { customId } = req.user;
        // should be end
        await prisma.penilaian.deleteMany({
            where: {
                id,
                user_custom_id: customId
            }
        });
        res.json({ code: 200, message: "succes" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const active = async (req, res) => {
    try {
        const { id } = req.query;
        const { customId } = req.user;
        await prisma.$transaction([
            prisma.penilaian.updateMany({
                data: {
                    aktif: true
                },
                where: {
                    id,
                    user_custom_id: customId
                }
            }),
            prisma.penilaian.updateMany({
                data: {
                    aktif: false
                },
                where: {
                    NOT: {
                        id: {
                            in: id
                        }
                    },
                    user_custom_id: customId
                }
            })
        ]);

        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

export default {
    index,
    get,
    create,
    update,
    remove,
    active
};
