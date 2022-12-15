const { default: prisma } = require("../lib/prisma");
const { totalKinerja } = require("../utils/total-kinerja");

const detailPenilaianAkhirPTT = async (req, res) => {
    try {
        const { niptt } = req?.query;
        const tahun = req?.query?.tahun || new Date().getFullYear();

        const result = await prisma.penilaian.findFirst({
            where: {
                aktif: true,
                user_custom_id: niptt,
                tahun: parseInt(tahun)
            },
            include: {
                pegawai: true,
                tugas_tambahan: true,
                target_penilaian: {
                    include: {
                        kinerja_bulanan: {
                            where: {
                                sudah_verif: true
                            }
                        },
                        ref_satuan_kinerja: true
                    }
                }
            }
        });

        const nilai = totalKinerja(
            result?.target_penilaian,
            result?.tugas_tambahan
        );

        res.json({
            nilai,
            listKegiatanTahunan: result?.target_penilaian,
            listPekerjaanTambahan: result?.tugas_tambahan
        });
        // todo akan diisi penilaian akhir berdasarkan ptt Id, kalem saja ya
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const riwayatPenilaianPTTPK = async (req, res) => {
    try {
        const { niptt } = req?.query;
        const employeeNumber = niptt?.split("|")[1];

        const { fetcher } = req;

        const result = await fetcher.get(
            `/master/pttpk/${employeeNumber}/riwayat-penilaian-pttpk`
        );

        res.json(result?.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = {
    detailPenilaianAkhirPTT,
    riwayatPenilaianPTTPK
};
