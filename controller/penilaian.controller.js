import prisma from "../lib/prisma";

const index = async (req, res) => {
  try {
    const { userId } = req.user;
    const result = await prisma.penilaian.findMany({
      where: {
        id_ptt: userId,
      },
      orderBy: {
        tahun: "desc",
      },
    });
    res.json(result);
  } catch (error) {
    console.log(error);
  }
};

const get = async (req, res) => {
  const { id } = req.query;
  const { userId } = req.user;

  const result = await prisma.penilaian.findFirst({
    where: {
      id: parseInt(id),
      id_ptt: userId,
    },
    include: {
      acc_kinerja_bulanan: true,
      kinerja_bulanan: true,
      target_penilaian: true,
    },
  });
  console.log(result);
  res.json(result);
};

const create = async (req, res) => {
  try {
    const { body } = req;
    const { userId } = req.user;
    const data = { ...body, id_ptt: userId };

    await prisma.penilaian.create({
      data,
    });

    res.json({ code: 200, message: "success" });
  } catch (error) {
    console.log(error);
  }
};

const update = async (req, res) => {};

const remove = async (req, res) => {
  try {
    const { id } = req.query;
    const { userId } = req.user;
    // should be end
    await prisma.penilaian.deleteMany({
      where: {
        id: parseInt(id),
        id_ptt: userId,
      },
    });
    res.json({ code: 200, message: "succes" });
  } catch (error) {
    console.log(error);
  }
};

const active = async (req, res) => {
  try {
    const { id } = req.query;
    const currentId = parseInt(id, 10);
    const { userId } = req.user;
    await prisma.$transaction([
      prisma.penilaian.updateMany({
        data: {
          aktif: true,
        },
        where: {
          id: currentId,
          id_ptt: userId,
        },
      }),
      prisma.penilaian.updateMany({
        data: {
          aktif: false,
        },
        where: {
          NOT: {
            id: {
              in: currentId,
            },
          },
          id_ptt: userId,
        },
      }),
    ]);

    res.json({ code: 200, message: "success" });
  } catch (error) {
    console.log(error);
  }
};

export default {
  index,
  get,
  create,
  update,
  remove,
  active,
};
