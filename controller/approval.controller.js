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
        console.log(error);
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    dataPenilaian
};
