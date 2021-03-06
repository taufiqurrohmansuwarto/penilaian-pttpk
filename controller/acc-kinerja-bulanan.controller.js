import prisma from "../lib/prisma";
import moment from "moment";

const kirimAtasan = async (req, res) => {
    const { userId } = req.user;
    const { bulan, tahun } = req.body;

    try {
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
                aktif: true,
                user_custom_id: customId
            }
        });

        if (penilaian) {
            const where = {
                id_penilaian: penilaian?.id,
                tahun: parseInt(tahun),
                bulan: parseInt(bulan),
                pegawai_id: customId
            };

            const result = await prisma.acc_kinerja_bulanan.findFirst({
                where
            });

            res.json(result);
        } else {
            res.status(404).json({ code: 404, message: "not found" });
        }
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
