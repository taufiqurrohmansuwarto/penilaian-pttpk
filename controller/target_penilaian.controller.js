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
        penilaian: true,
      },
    });
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ code: 400 });
  }
};

const detail = async (req, res) => {};

const create = async (req, res) => {};

const update = async (req, res) => {};

const remove = async (req, res) => {};

export default {
  index,
  detail,
  create,
  update,
  remove,
};
