const { default: prisma } = require("../lib/prisma");

const kirimAtasan = async (req, res) => {
    const { id } = req.query;
    const { userId } = req.user;
    const { bulan, tahun } = req.body;

    try {
        const currentPenilaian = await prisma.penilaian.findUnique({
            where: {
                id
            }
        });

        // ke atasan langsung
        await prisma.acc_kinerja_bulanan.create({
            data: {
                bulan,
                tahun,
                diverif_oleh: currentPenilaian.nip_atasan_langsung,
                id_penilaian: id,
                id_ptt: userId
            }
        });

        res.json({ code: 200, message: "sukses" });
        // insert ke
    } catch (error) {
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
