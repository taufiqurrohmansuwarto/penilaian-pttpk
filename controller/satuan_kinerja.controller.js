import prisma from "../lib/prisma";

const index = async (req, res) => {
  const result = await prisma.ref_satuan_kinerja.findMany();
  res.json(result);
};

const get = async (req, res) => {
  const { id } = req.query;
  const result = await prisma.ref_satuan_kinerja.findFirst({
    where: {
      id,
    },
  });
};

const create = async (req, res) => {
  const { body } = req;
  await prisma.ref_satuan_kinerja.createMany({
    data: body,
  });
};

const update = async (req, res) => {
  const { id } = req.query;
  const { body } = req;
  await prisma.ref_satuan_kinerja.update({
    data: body,
    where: {
      id,
    },
  });
};

const remove = async (req, res) => {
  const { id } = req.query;
  await prisma.ref_satuan_kinerja.delete({
    where: {
      id,
    },
  });
};

export default {
  index,
  get,
  create,
  update,
  remove,
};
