import prisma from "../lib/prisma";

const index = async (req, res) => {
  const { id } = req.query;
  const { userId } = req.user;

  try {
    const result = await prisma.target_penilaian.findMany({
      where: {
        id_penilaian: parseInt(id),
        penilaian: {
          id_ptt: userId,
        },
      },
      include: {
        ref_satuan_kinerja: true,
      },
      orderBy: {
        created_at: "asc",
      },
    });
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ code: 400 });
  }
};

const detail = async (req, res) => {
  const { id } = req.query;
  const { userId } = req.user;
  try {
    const result = prisma.target_penilaian.findFirst({
      where: {
        id_penilaian: parseInt(id),
        penilaian: {
          id_ptt: userId,
        },
      },
    });
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ code: 400, message: "Internal Server Error" });
  }
};

const create = async (req, res) => {
  const { id } = req.query;
  const { userId } = req.user;
  const { body } = req;
  const data = { ...body, id_ptt: userId, id_penilaian: parseInt(id) };

  try {
    await prisma.target_penilaian.create({
      data: {
        kuantitas: data?.kuantitas,
        pekerjaan: data?.pekerjaan,
        id_ptt: userId,
        ref_satuan_kinerja: {
          connect: {
            id: parseInt(data?.ref_satuan_kinerja_id),
          },
        },
        penilaian: {
          connect: {
            id: parseInt(data?.id_penilaian),
          },
        },
      },
    });
    res.json({ code: 200, message: "success" });
  } catch (error) {
    res.json({ code: 400, message: "Internal Server Errror" });
    console.log(error);
  }
};

const update = async (req, res) => {
  const { id, targetId } = req.query;
  const { userId } = req.user;
  const { body } = req;
  const data = { ...body, id_ptt: userId, id_penilaian: parseInt(id) };

  try {
    await prisma.target_penilaian.updateMany({
      data,
      where: {
        id: parseInt(targetId),
        id_penilaian: parseInt(id),
        id_ptt: userId,
      },
    });
    res.json({ code: 200, message: "success" });
  } catch (error) {
    console.log(error);
    res.json({ code: 400, message: "Internal Server Error" });
  }
};

const remove = async (req, res) => {
  const { id, targetId } = req.query;
  const { userId } = req.user;

  try {
    await prisma.target_penilaian.deleteMany({
      where: {
        id: parseInt(targetId),
        penilaian: {
          id_ptt: userId,
          id: parseInt(id),
        },
      },
    });
    res.json({ code: 200, message: "success" });
  } catch (error) {
    res.json({ code: 400, message: "Internal Server Error" });
  }
};

export default {
  index,
  detail,
  create,
  update,
  remove,
};
