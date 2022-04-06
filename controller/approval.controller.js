import moment from "moment";
import prisma from "../lib/prisma";

const dataPenilaian = async (req, res) => {
    const bulan = moment(new Date()).format("M");
    const tahun = moment(new Date()).format("YYYY");
    const { customId, userId } = req?.user;

    const queryBulan = req?.query?.bulan || bulan;
    const queryTahun = req?.query?.tahun || tahun;

    const limit = req.query?.limit || 10;
    const offset = req.query?.offset || 0;

    try {
        const result = await prisma.acc_kinerja_bulanan.findMany({
            where: {
                penilaian: {
                    aktif: true,
                    nip_atasan_langsung: userId?.toString()
                },
                bulan: parseInt(queryBulan),
                diverif_oleh: customId,
                tahun: parseInt(queryTahun)
            },
            include: {
                user_ptt: true
            },
            take: limit,
            skip: offset
        });
        res.json(result);
    } catch (error) {
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

const getListPenilaianBulanan = async (req, res) => {
    try {
        const { id, bulan, tahun } = req.query;

        const result = await prisma.penilaian.findFirst({
            where: {
                id: parseInt(id),
                aktif: true
            },
            include: {
                kinerja_bulanan: {
                    where: {
                        bulan: parseInt(bulan),
                        tahun: parseInt(tahun)
                    },
                    include: {
                        target_penilaian: {
                            include: {
                                ref_satuan_kinerja: true
                            }
                        }
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

const approvePenilaianBulanan = async (req, res) => {
    try {
        const { body } = req;
        const verifApproval = body?.map((d) => {
            const { id, ...data } = d;
            return prisma.kinerja_bulanan.update({
                data: {
                    ...data
                },
                where: {
                    id: d?.id
                }
            });
        });

        prisma.acc_kinerja_bulanan.update({
            where: {
                id_penilaian_bulan_tahun_custom_id_ptt: {
                    bulan: parseInt(req.query?.bulan),
                    tahun: parseInt(req.query?.tahun),
                    id_penilaian: req.query?.id,
                    custom_id_ptt: req.user?.customId
                }
            },
            data: {
                sudah_verif: true
            }
        });

        await prisma.$transaction([
            ...verifApproval,
            prisma.acc_kinerja_bulanan.update({
                where: {
                    id_penilaian_bulan_tahun_custom_id_ptt: {
                        bulan: parseInt(req.query?.bulan),
                        tahun: parseInt(req.query?.tahun),
                        id_penilaian: req.query?.id,
                        custom_id_ptt: req.user?.customId
                    }
                }
            })
        ]);

        // ini harus diupdate

        res.json({ code: 200, message: "ok" });
    } catch (error) {
        console.log(error);
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    dataPenilaian,
    getListPenilaianBulanan,
    approvePenilaianBulanan
};
