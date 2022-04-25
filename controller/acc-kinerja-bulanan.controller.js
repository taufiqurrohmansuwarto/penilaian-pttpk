import prisma from "../lib/prisma";
import moment from "moment";

const kirimAtasan = async (req, res) => {
    const { userId } = req.user;
    const { bulan, tahun } = req.body;

    try {
        console.log("test");
        const result = await prisma.penilaian.findFirst({
            where: {
                aktif: true
            }
        });

        await prisma.acc_kinerja_bulanan.create({
            data: {
                tahun,
                user: userId,
                id_penilaian: result.id,
                bulan
            }
        });

        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

const requestPenilaianUser = async (req, res) => {
    const { customId } = req.user;
    const bulan = req.query?.bulan || parseInt(moment(new Date()).format("M"));
    const tahun =
        req.query?.tahun || parseInt(moment(new Date()).format("YYYY"));

    try {
        const penilaian = await prisma.penilaian.findFirst({
            where: {
                aktif: true
            }
        });

        const result = await prisma.acc_kinerja_bulanan.findFirst({
            where: {
                // id_penilaian: penilaian?.id,
                id_penilaian: penilaian?.id,
                tahun: parseInt(tahun),
                bulan: parseInt(bulan),
                pegawai_id: customId
            }
        });

        console.log(result);

        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const batalKirimAtasan = async (req, res) => {
    const { userId } = req.user;
    const { accId } = req.query;

    try {
        await prisma.acc_kinerja_bulanan.deleteMany({
            where: {
                id_ptt: userId,
                id: accId,
                penilaian: {
                    id_ptt: userId,
                    aktif: true
                }
            }
        });
        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    batalKirimAtasan,
    kirimAtasan,
    requestPenilaianUser
};
