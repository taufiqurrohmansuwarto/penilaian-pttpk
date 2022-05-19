const { default: prisma } = require("../lib/prisma");
import moment from "moment";
import { sendEmail } from "../utils/trigger";

// jadi ketika batal kirim maka nilai nya direset kembali menjadi 0 dan di acc kinerja bulanan dihapus
const batalKirimTransaction = async (
    penilaianId,
    userCustomId,
    nipAtasanLangsung,
    listIdPenilaian,
    bulan,
    tahun
) => {
    return await prisma.$transaction(async (prisma) => {
        await prisma.acc_kinerja_bulanan.deleteMany({
            where: {
                id_penilaian: penilaianId,
                bulan,
                tahun,
                pegawai_id: userCustomId
                // id_atasan_langsung: nipAtasanLangsung
            }
        });
        await prisma.kinerja_bulanan.updateMany({
            where: {
                id: {
                    in: listIdPenilaian
                }
            },
            data: {
                kualitas: 0,
                sudah_verif: false
            }
        });
        return true;
    });
};

const kirimAtasan = async (req, res) => {
    const { customId } = req.user;
    const queryBulan = req.query?.bulan || moment(new Date()).format("M");
    const queryTahun = req.query?.tahun || moment(new Date().format("YYYY"));

    // bulan dan tahun
    const bulan = parseInt(queryBulan);
    const tahun = parseInt(queryTahun);

    try {
        const currentPenilaian = await prisma.penilaian.findFirst({
            where: {
                aktif: true,
                user_custom_id: customId
            }
        });

        if (!currentPenilaian) {
            res.status(404).json({
                code: 404,
                message: "Tidak ada penilaian yang aktif"
            });
        } else {
            await prisma.acc_kinerja_bulanan.upsert({
                where: {
                    id_penilaian_bulan_tahun: {
                        id_penilaian: currentPenilaian?.id,
                        bulan,
                        tahun
                    }
                },
                create: {
                    bulan,
                    tahun,
                    atasan_langsung: currentPenilaian?.atasan_langsung,
                    pegawai: {
                        connect: {
                            custom_id: customId
                        }
                    },
                    id_atasan_langsung: currentPenilaian?.id_atasan_langsung,
                    penilaian: {
                        connect: {
                            id: currentPenilaian?.id
                        }
                    }
                },
                update: {
                    id_atasan_langsung: currentPenilaian?.id_atasan_langsung,
                    atasan_langsung: currentPenilaian?.atasan_langsung
                }
            });

            // send to user
            const penilai = await prisma.users.findUnique({
                where: {
                    custom_id: currentPenilaian?.id_atasan_langsung
                }
            });

            const currentUser = await prisma.users.findUnique({
                where: {
                    custom_id: customId
                }
            });

            if (penilai && currentUser) {
                const to = penilai?.email;
                const text = `PTTPK atas nama ${currentUser?.username} telah mengirimkan penilaian bulanan, bulan ${bulan} tahun ${tahun} ke anda. Mohon segera dilakukan ACC.`;
                await sendEmail(to, text);
            }

            res.json({ code: 200, message: "sukses" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const batalKirimAtasan = async (req, res) => {
    const { customId } = req.user;
    const queryBulan = req.query?.bulan || moment(new Date()).format("M");
    const queryTahun = req.query?.tahun || moment(new Date().format("YYYY"));

    // bulan dan tahun
    const bulan = parseInt(queryBulan);
    const tahun = parseInt(queryTahun);

    try {
        const currentPenilaian = await prisma.penilaian?.findFirst({
            where: {
                user_custom_id: customId,
                aktif: true
            }
        });

        if (!currentPenilaian) {
            res.status(404).json({ code: 404, message: "Not Found" });
        } else {
            const listIdPenilaian = await prisma.kinerja_bulanan.findMany({
                where: {
                    bulan,
                    tahun,
                    id_penilaian: currentPenilaian?.id
                },
                select: {
                    id: true
                }
            });

            // custom transaction
            await batalKirimTransaction(
                currentPenilaian?.id,
                customId,
                currentPenilaian?.id_atasan_langsung,
                listIdPenilaian?.map((l) => l?.id),
                bulan,
                tahun
            );
            res.json({ code: 200, message: "sukses" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    kirimAtasan,
    batalKirimAtasan
};
