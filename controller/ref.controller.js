import prisma from "../lib/prisma";

const ref = async (req, res) => {
  const show = req.query?.show || "satuan";
  console.log(show);

  try {
    if (show === "satuan") {
      const result = await prisma.ref_satuan_kinerja.findMany();
      res.json(result);
    }
  } catch (error) {
    console.log(error);
  }
};

export default {
  ref,
};
