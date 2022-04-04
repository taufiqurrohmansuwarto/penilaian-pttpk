const { default: prisma } = require("../lib/prisma");
import moment from "moment";

const kirimAtasan = async (req, res) => {
    const { userId } = req.user;
    const bulan = req.query?.bulan || moment(new Date()).format("M");
    const tahun = req.query?.tahun || moment(new Date().format("YYYY"));

    try {
        const currentPenilaian = await prisma.penilaian.findFirst({
            where: {
                aktif: true
            }
        });

        // ke atasan langsung
        await prisma.acc_kinerja_bulanan.upsert({
            where: {
                id_penilaian_bulan_tahun_id_ptt: {
                    bulan: parseInt(bulan),
                    tahun: parseInt(tahun),
                    id_penilaian: currentPenilaian?.id,
                    id_ptt: userId
                }
            },
            create: {
                bulan: parseInt(bulan),
                tahun: parseInt(tahun),
                diverif_oleh: `master|${currentPenilaian?.nip_atasan_langsung}`,
                id_penilaian: currentPenilaian?.id,
                id_ptt: userId
            },
            update: {
                diverif_oleh: `master|${currentPenilaian?.nip_atasan_langsung}`
            }
        });

        res.json({ code: 200, message: "sukses" });
        // insert ke
    } catch (error) {
        console.log(error);
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

const batalKirimAtasan = async (req, res) => {
    const { id } = req.query;
    const { userId } = req.user;
    const { bulan, tahun } = req.query;

    try {
        await prisma.acc_kinerja_bulanan.deleteMany({
            where: {
                id_ptt: userId,
                id_penilaian: id,
                bulan,
                tahun
            }
        });
        //
        res.json({ code: 200, message: "sukses" });
    } catch (error) {
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    kirimAtasan,
    batalKirimAtasan
};
