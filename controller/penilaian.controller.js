import prisma from "../lib/prisma";

const index = async (req, res) => {
  const result = await prisma.penilaian.findMany();
  res.json(result);
};

const get = async (req, res) => {
  const { id } = req.query;
  const result = await prisma.penilaian.findUnique({
    where: {
      id,
    },
  });
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

export default {
  index,
  get,
  create,
  update,
  remove,
};
