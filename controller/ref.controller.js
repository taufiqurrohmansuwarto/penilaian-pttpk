import prisma from "../lib/prisma";

const ref = async (req, res) => {
    const show = req.query?.show || "satuan";

    try {
        if (show === "satuan") {
            const result = await prisma.ref_satuan_kinerja.findMany();
            res.json(result);
        } else if (show === "satuan-kinerja") {
        }
    } catch (error) {
        console.log(error);
    }
};

export default {
    ref
};
