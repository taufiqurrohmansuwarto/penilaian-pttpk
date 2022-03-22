import prisma from "../lib/prisma";

const kirimAtasan = async (req, res) => {
    const { userId } = req.user;
    const { bulan, tahun } = req.body;

    try {
        await prisma.acc_kinerja_bulanan.create({
            data: {
                tahun,
                id_ptt: userId,
                bulan
            }
        });
        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.json({ code: 400, message: "Internal Server Error" });
    }
};

const batalKirimAtasan = async (req, res) => {
    const { userId } = req.user;
    try {
    } catch (error) {}
};
