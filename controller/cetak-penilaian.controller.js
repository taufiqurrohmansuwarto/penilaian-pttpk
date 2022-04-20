import moment from "moment";
import prisma from "../lib/prisma";
import axios from "axios";
import { generatePdf } from "../utils/create-pdf-bulanan";

const fonts = {
    Roboto: {
        normal: "fonts/GILLSANS.ttf",
        regular: "fonts/GILLSANS.ttf",
        bold: "fonts/GillSans-Bold.ttf",
        italics: "fonts/Garamond-Italic.ttf"
    },
    Spartan: {
        regular: "fonts/leaguespartan-bold.ttf",
        normal: "fonts/leaguespartan-bold.ttf"
    },
    OpenSans: {
        regular: "fonts/OpenSansRegular.ttf",
        normal: "fonts/OpenSansRegular.ttf",
        bold: "fonts/OpenSans-Bold.ttf"
    }
};

const pdfPrinter = require("pdfmake");
const printer = new pdfPrinter(fonts);

const cetakPenilaianBulananUser = async (req, res) => {
    const { customId } = req.user;
    const queryBulan = req.query?.bulan || moment(new Date()).format("M");
    const queryTahun = req.query?.tahun || moment(new Date()).format("YYYY");
    const { body } = req;

    console.log(body);

    const bulan = parseInt(queryBulan);
    const tahun = parseInt(queryTahun);

    try {
        const penilaian = await prisma.penilaian.findFirst({
            where: {
                aktif: true,
                user_custom_id: customId,
                acc_kinerja_bulanan: {
                    some: {
                        bulan,
                        tahun,
                        sudah_verif: true
                    }
                }
            },
            include: {
                pegawai: true
            }
        });

        const accKinerjaBulanan = await prisma.acc_kinerja_bulanan.findFirst({
            where: {
                bulan,
                tahun,
                sudah_verif: true,
                pegawai_id: customId,
                penilaian: {
                    aktif: true,
                    user_custom_id: customId
                }
            }
        });

        const listPenilaianBulanan = await prisma.kinerja_bulanan.findMany({
            where: {
                bulan,
                tahun,
                penilaian: {
                    user_custom_id: customId,
                    aktif: true,
                    acc_kinerja_bulanan: {
                        some: {
                            sudah_verif: true,
                            bulan,
                            tahun
                        }
                    }
                }
            },
            include: {
                target_penilaian: {
                    include: {
                        ref_satuan_kinerja: true
                    }
                }
            }
        });

        const currentFoto = await axios.get(`${penilaian?.pegawai?.image}`, {
            responseType: "arraybuffer"
        });

        const base64 = Buffer.from(currentFoto.data).toString("base64");

        const data = {
            id: penilaian?.id,
            nama: penilaian?.pegawai?.username,
            foto: base64,
            niptt: penilaian?.pegawai?.employee_number,
            pengalaman: `${penilaian?.pengalaman_kerja} tahun`,
            jabatan: penilaian?.jabatan?.nama,
            skpd: penilaian?.skpd?.detail,
            catatan: accKinerjaBulanan?.catatan,
            bulan,
            tahun,
            listKegiatanBulanan: listPenilaianBulanan,

            // this motherfucker shit is data from client
            ttd: {
                tempat: body?.tempat,
                tanggal: body?.tanggal,
                is_having_atasnama: body?.is_having_atasnama,
                pejabat: {
                    nama: body?.pejabat_penandatangan?.nama,
                    nip: body?.pejabat_penandatangan?.nip,
                    golongan: body?.pejabat_penandatangan?.golongan,
                    pangkat: body?.pejabat_penandatangan?.pangkat
                },
                jabatan_penandatangan: body?.jabatan_penandatangan
            }
        };

        const dd = generatePdf(data);
        const doc = printer.createPdfKitDocument(dd);

        doc.end();
        res.setHeader("Content-type", "application/pdf");
        res.setHeader("Content-disposition", 'inline; filename="Example.pdf"');
        doc.pipe(res);
        // res.json({ listPenilaianBulanan, penilaian, accKinerjaBulanan });
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    cetakPenilaianBulananUser
};
