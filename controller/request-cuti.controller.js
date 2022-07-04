const { default: prisma } = require("../lib/prisma");

const kirimAtasanCuti = async (req, res) => {
    try {
        const { customId } = req?.user;
        const queryBulan = req.query?.bulan || moment(new Date()).format("M");
        const queryTahun =
            req.query?.tahun || moment(new Date().format("YYYY"));

        const bulan = parseInt(queryBulan);
        const tahun = parseInt(queryTahun);

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
            // upsert first
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
                    is_cuti: true,
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

            // hapus semua kinerja bulanannya di bulan dan tahun itu  dengan id penilaian bulanan
            await prisma.kinerja_bulanan.deleteMany({
                where: {
                    id_penilaian: currentPenilaian?.id,
                    bulan,
                    tahun
                }
            });

            res.status(200).json({ code: 200, message: "success" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const batalKirimAtasanCuti = async (req, res) => {
    try {
        const { bulan, tahun } = req?.query;
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    kirimAtasanCuti,
    batalKirimAtasanCuti
};
