import prisma from "../lib/prisma";

const index = async (req, res) => {
  const result = await prisma.penilaian.findMany();
  res.json(result);
};

const get = async (req, res) => {
  const { id } = req.query;
  const result = await prisma.penilaian.findUnique({
    where: {
      id: parseInt(id),
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
  const { body } = req;
  await prisma.penilaian.create({
    data: body,
  });
  res.json({ code: 200, message: "success" });
};

const update = async (req, res) => {};

const remove = async (req, res) => {
  const { id } = req.query;
  // should be end
  await prisma.penilaian.delete({
    where: {
      id,
    },
  });
};

const active = async (req, res) => {
  const { id } = req.query;
  await prisma.$transaction([
    prisma.penilaian.update({
      data: {
        aktif: true,
      },
      where: {
        id,
      },
    }),
    prisma.penilaian.updateMany({
      data: {
        aktif: false,
      },
      where: {
        NOT: {
          id: {
            notIn: id,
          },
        },
      },
    }),
  ]);

  res.json({ code: 200, message: "success" });
};

export default {
  index,
  get,
  create,
  update,
  remove,
  active,
};
