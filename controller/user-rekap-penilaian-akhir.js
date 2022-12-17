import prisma from "../lib/prisma";
import { totalNilaiAspekPekerjaan } from "../src/utils/util";
import { totalKinerja } from "../utils/total-kinerja";

const rekapPenilaianAkhirPTT = async (req, res) => {
    try {
        const { customId: niptt } = req?.user;

        const result = await prisma.penilaian.findFirst({
            where: {
                aktif: true,
                user_custom_id: niptt
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

        const nilaiAspekPekerjaan = totalNilaiAspekPekerjaan(result);
        const capaianKinerja =
            nilai?.totalPenilaianPekerjaan + nilai?.totalKegiatanTambahan;
        const rekom = nilaiAspekPekerjaan > 70 && capaianKinerja > 70;

        res.json({
            ...nilai,
            result,
            totalNilaiAspekPekerjaan: nilaiAspekPekerjaan,
            totalNilaiCapaianKinerja: capaianKinerja,
            rekom
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

module.exports = { rekapPenilaianAkhirPTT };
