import moment from "moment";
import prisma from "../lib/prisma";

const detail = async (req, res) => {
  const { userId } = req.user;
  try {
  } catch (error) {}
};

const index = async (req, res) => {
  const { userId } = req.user;
  const bulan = req.query?.bulan || moment(new Date()).format("MM");
  const tahun = req.query?.bulan || moment(new Date()).format("YYYY");

  try {
    const result = await prisma.kinerja_bulanan.findMany({
      where: {
        id_ptt: userId,
        bulan: parseInt(bulan),
        tahun: parseInt(tahun),
        penilaian: {
          aktif: true,
          id_ptt: userId,
        },
      },
      select: {
        id: true,
        bulan: true,
        tahun: true,
        deskripsi_pekerjaan: true,
        kuantitas: true,
        tgl_mulai_pekerjaan: true,
        tgl_selesai_pekerjaan: true,
        created_at: true,
        penilaian: {
          select: {
            id: true,
            target_penilaian: {
              select: {
                pekerjaan: true,
                kuantitas: true,
                ref_satuan_kinerja: {
                  select: {
                    id: true,
                    nama: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ code: 400, message: "Internal Server Error" });
  }
};

const update = async (req, res) => {};

const remove = async (req, res) => {};

export default {
  detail,
  index,
  update,
  remove,
};
