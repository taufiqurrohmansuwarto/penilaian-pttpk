import moment from "moment";
import prisma from "../lib/prisma";
import { sendEmail } from "../utils/trigger";

const dataPenilaian = async (req, res) => {
    const bulan = moment(new Date()).format("M");
    const tahun = moment(new Date()).format("YYYY");
    const { customId, userId } = req?.user;

    const queryBulan = req?.query?.bulan || bulan;
    const queryTahun = req?.query?.tahun || tahun;

    const limit = req.query?.limit || 200;
    const offset = req.query?.offset || 0;

    try {
        const result = await prisma.acc_kinerja_bulanan.findMany({
            where: {
                bulan: parseInt(queryBulan),
                tahun: parseInt(queryTahun),
                id_atasan_langsung: customId,
                penilaian: {
                    aktif: true
                }
            },
            include: {
                pegawai: true
            },
            take: limit,
            skip: offset
        });
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const getListPenilaianBulanan = async (req, res) => {
    try {
        const { id, bulan, tahun } = req.query;

        const result = await prisma.penilaian.findFirst({
            where: {
                id,
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
                                ref_satuan_kinerja: true,
                                kinerja_bulanan: {
                                    where: {
                                        id_penilaian: id,
                                        sudah_verif: true
                                    }
                                }
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

// todo this should be wrapper to transaction
const approvePenilaianBulanan = async (req, res) => {
    try {
        const { body } = req;
        const bulan = parseInt(req?.query?.bulan);
        const tahun = parseInt(req?.query?.tahun);
        const id_penilaian = req.query?.id;
        const id_ptt = req.query?.id_ptt;
        const id_atasan_langsung = req.user?.customId;

        const verifApproval = body?.list?.map((d) => {
            const { id, ...data } = d;
            return prisma.kinerja_bulanan.update({
                data: {
                    ...data,
                    sudah_verif: true
                },
                where: {
                    id: d?.id
                }
            });
        });

        await prisma.$transaction([
            ...verifApproval,
            prisma.acc_kinerja_bulanan.updateMany({
                where: {
                    id_penilaian,
                    tahun,
                    bulan,
                    id_atasan_langsung,
                    penilaian: {
                        aktif: true,
                        user_custom_id: id_ptt
                    }
                },
                data: {
                    sudah_verif: true,
                    catatan: body?.catatan,
                    updated_at: new Date()
                }
            })
        ]);

        const currentUser = await prisma.users.findUnique({
            where: {
                custom_id: id_ptt
            }
        });

        if (currentUser && currentUser?.email) {
            await sendEmail(
                currentUser?.email,
                `Penilaian Bulan ${bulan} tahun ${tahun} telah dinilai dan di acc atasan anda`
            );
        }

        // ini harus diupdate

        res.json({ code: 200, message: "ok" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    dataPenilaian,
    getListPenilaianBulanan,
    approvePenilaianBulanan
};
