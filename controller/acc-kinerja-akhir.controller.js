const { default: prisma } = require("../lib/prisma");

const kirimAtasanUser = async (req, res) => {
    const { customId } = req.user;

    try {
        await prisma.penilaian.updateMany({
            where: {
                aktif: true,
                user_custom_id: customId
            },
            data: {
                status: "diajukan"
            }
        });

        res.status(200).json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const batalKirimAtasanUser = async (req, res) => {
    const { customId } = req.user;

    try {
        await prisma.penilaian.updateMany({
            where: {
                aktif: true,
                user_custom_id: customId
            },
            data: {
                status: "dikerjakan",
                integritas: 0,
                kedisiplinan: 0,
                orientasi_pelayanan: 0,
                kerjasama_koordinasi: 0,
                pemanfaatan_alat_dan_media_kerja: 0,
                catatan: null,
                tanggal_verif: null
            }
        });
        res.json({ code: 200, message: "Success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const accKinerjaApproval = async (req, res) => {
    const { customId } = req.user;
    const queryTahun = req?.query?.tahun || moment(new Date()).format("YYYY");
    const ptt_id = req.query?.id_ptt;

    const tahun = parseInt(queryTahun);
    const { body } = req;

    try {
        await prisma.penilaian.updateMany({
            where: {
                tahun,
                id_atasan_langsung: customId,
                status: "diajukan",
                user_custom_id: ptt_id
            },
            data: {
                status: "diverif",
                tanggal_verif: new Date(),
                ...body
            }
        });
        res.json({ code: 200, message: "success" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const listKinerjaApproval = async (req, res) => {
    const queryTahun = req.query?.tahun || moment(new Date()).format("YYYY");
    const tahun = parseInt(queryTahun);
    const { customId } = req.user;

    try {
        const result = await prisma.penilaian.findMany({
            where: {
                tahun,
                aktif: true,
                id_atasan_langsung: customId,
                status: "diajukan"
            },
            include: {
                pegawai: true,
                target_penilaian: {
                    include: {
                        kinerja_bulanan: true,
                        ref_satuan_kinerja: true
                    }
                }
            }
        });
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    kirimAtasanUser,
    batalKirimAtasanUser,
    accKinerjaApproval,
    listKinerjaApproval
};
