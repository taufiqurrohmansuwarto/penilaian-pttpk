import moment from "moment";
import prisma from "../lib/prisma";

const detail = async (req, res) => {
    const { userId } = req.user;
    try {
    } catch (error) {}
};

const create = async (req, res) => {
    const { userId } = req.user;
    const { body } = req;

    try {
        const result = await prisma.penilaian.findFirst({
            where: {
                aktif: true,
                id_ptt: userId
            },
            select: {
                id: true,
                aktif: true
            }
        });

        if (!result || !result.aktif) {
            res.json({ code: 404, message: "Penilaian Belum aktif" });
        } else {
            const hasil = await prisma.kinerja_bulanan.create({
                data: {
                    bulan: body?.bulan,
                    tahun: body?.tahun,
                    title: body?.title,
                    start: body?.start,
                    kuantitas: body?.kuantitas,
                    end: body?.end,
                    id_ptt: userId,
                    target_penilaian: {
                        connect: {
                            id: body?.id_target_penilaian
                        }
                    },
                    penilaian: {
                        connect: {
                            id: result?.id
                        }
                    }
                }
            });
            res.json(hasil);
        }
    } catch (error) {
        console.log(error);
    }
};

const index = async (req, res) => {
    const { userId } = req.user;
    const bulan = req.query?.bulan || moment(new Date()).format("M");
    const tahun = req.query?.tahun || moment(new Date()).format("YYYY");

    try {
        const result = await prisma.kinerja_bulanan.findMany({
            where: {
                id_ptt: userId,
                bulan: parseInt(bulan),
                tahun: parseInt(tahun),
                penilaian: {
                    aktif: true,
                    id_ptt: userId
                }
            },
            orderBy: {
                created_at: "desc"
            },
            select: {
                id: true,
                bulan: true,
                tahun: true,
                title: true,
                kuantitas: true,
                start: true,
                end: true,
                created_at: true,
                id_penilaian: true,
                id_target_penilaian: true,
                target_penilaian: {
                    select: {
                        id: true,
                        kuantitas: true,
                        pekerjaan: true,
                        ref_satuan_kinerja: {
                            select: {
                                id: true,
                                nama: true
                            }
                        }
                    }
                },
                penilaian: {
                    select: {
                        id: true
                    }
                }
            }
        });
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

const update = async (req, res) => {
    const { userId } = req.user;
    const { id: bulananId } = req.query;
    const {
        body: { id, title, start, end, kuantitas, targetId }
    } = req;

    try {
        await prisma.kinerja_bulanan.update({
            data: {
                title,
                start,
                end,
                kuantitas,
                target_penilaian: {
                    connect: {
                        id: targetId
                    }
                },
                penilaian: {
                    update: {
                        aktif: true,
                        id_ptt: userId
                    }
                }
            },
            where: {
                id: parseInt(bulananId)
            }
        });
        // must be search first
        const hasil = await prisma.kinerja_bulanan.findFirst({
            where: {
                id: parseInt(bulananId),
                id_ptt: userId,
                penilaian: {
                    aktif: true,
                    id_ptt: userId
                }
            }
        });
        res.status(200).json(hasil);
    } catch (error) {
        console.log(error);
        res.status(404).json({ code: 400, message: "Internal Server Error" });
    }
};

const remove = async (req, res) => {
    const { userId } = req.user;
    const { id } = req.query;
    try {
        await prisma.kinerja_bulanan.deleteMany({
            where: {
                id: parseInt(id),
                id_ptt: userId
            }
        });
        res.json({ code: 200, message: "Success" });
    } catch (error) {
        console.log(error);
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

export default {
    detail,
    index,
    update,
    create,
    remove
};
