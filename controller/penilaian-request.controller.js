const { default: prisma } = require("../lib/prisma");
import moment from "moment";

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
            res.status(404).json({ code: 404, message: "Not Found" });
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
                    pegawai: {
                        connect: {
                            custom_id: customId
                        }
                    },
                    id_atasan_langsung: `master|${currentPenilaian?.nip_atasan_langsung}`,
                    penilaian: {
                        connect: {
                            id: currentPenilaian?.id
                        }
                    }
                },
                update: {
                    id_atasan_langsung: `master|${currentPenilaian?.nip_atasan_langsung}`
                }
            });

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
            await prisma.acc_kinerja_bulanan.deleteMany({
                where: {
                    id_penilaian: currentPenilaian?.id,
                    bulan,
                    tahun,
                    pegawai_id: customId,
                    id_atasan_langsung: `master|${currentPenilaian?.nip_atasan_langsung}`
                }
            });
            res.json({ code: 200, message: "sukses" });
        }
    } catch (error) {
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    kirimAtasan,
    batalKirimAtasan
};
