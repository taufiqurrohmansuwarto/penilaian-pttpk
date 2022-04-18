import prisma from "../lib/prisma";

const ref = async (req, res) => {
    const show = req.query?.show || "satuan";
    const { customId } = req.user;

    try {
        if (show === "satuan") {
            const result = await prisma.ref_satuan_kinerja.findMany();
            res.json(result);
        }

        if (show === "target") {
            const result = await prisma.target_penilaian.findMany({
                where: {
                    penilaian: {
                        aktif: true,
                        user_custom_id: customId
                    }
                },
                include: {
                    ref_satuan_kinerja: true
                }
            });
            res.json(result);
        }
    } catch (error) {
        console.log(error);
    }
};

export default {
    ref
};
