import moment from "moment";
import prisma from "../lib/prisma";
import axios from "axios";
import { generatePdf } from "../utils/create-pdf-bulanan";
import { generateKinerjaTahunanFull } from "../utils/create-pdf-tahunan";
import { totalKinerja, totalNilaiPerilaku } from "../utils/total-kinerja";

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

    const bulan = parseInt(queryBulan);
    const tahun = parseInt(queryTahun);

    try {
        const penilaian = await prisma.penilaian.findFirst({
            where: {
                aktif: true,
                user_custom_id: customId
            },
            include: {
                pegawai: true,
                acc_kinerja_bulanan: {
                    where: {
                        bulan,
                        tahun,
                        sudah_verif: true
                    }
                }
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
            },
            penilai: accKinerjaBulanan?.atasan_langsung?.label[0],
            tanggal_dinilai: accKinerjaBulanan?.updated_at
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

// ini dicetak berdasarkan status yang aktif bukan dari id
const cetakPenilaianAkhirUser = async (req, res) => {
    try {
        const { customId } = req.user;
        const result = await prisma.penilaian.findFirst({
            where: {
                aktif: true,
                user_custom_id: customId,
                status: "diverif"
            },
            include: {
                pegawai: true,
                tugas_tambahan: true,
                target_penilaian: {
                    include: {
                        kinerja_bulanan: {
                            where: {
                                sudah_verif: true
                            }
                        },
                        ref_satuan_kinerja: true
                    }
                }
            }
        });

        if (!result) {
            res.status(404).json({ code: 404, message: "Not Found" });
        } else {
            const currentFoto = await axios.get(`${result?.pegawai?.image}`, {
                responseType: "arraybuffer"
            });

            const base64 = Buffer.from(currentFoto.data).toString("base64");

            const {
                integritas,
                kedisiplinan,
                orientasi_pelayanan,
                kerjasama_koordinasi,
                pemanfaatan_alat_dan_media_kerja
            } = result;

            // terdapat 4 macam perilaku
            const nilaiPerilaku = {
                integritas: integritas * 0.25,
                kedisiplinan: kedisiplinan * 0.25,
                orientasi_pelayanan: orientasi_pelayanan * 0.2,
                kerjasama_koordinasi: kerjasama_koordinasi * 0.2,
                pemanfaatan_alat_dan_media_kerja:
                    pemanfaatan_alat_dan_media_kerja * 0.1
            };

            const totalNilaiPerilaku =
                nilaiPerilaku.integritas +
                nilaiPerilaku.kedisiplinan +
                nilaiPerilaku.orientasi_pelayanan +
                nilaiPerilaku.kerjasama_koordinasi +
                nilaiPerilaku.pemanfaatan_alat_dan_media_kerja;

            const currentPerilaku = [
                {
                    name: "Integritas",
                    bobot: "25%",
                    nilai: nilaiPerilaku.integritas,
                    nilaiSekarang: integritas
                },
                {
                    name: "Kedisiplinan",
                    bobot: "25%",
                    nilai: nilaiPerilaku.kedisiplinan,
                    nilaiSekarang: kedisiplinan
                },
                {
                    name: "Orientasi Pelayanan",
                    bobot: "20%",
                    nilai: nilaiPerilaku.orientasi_pelayanan,
                    nilaiSekarang: orientasi_pelayanan
                },
                {
                    name: "Kerjasama Dan Koordinasi",
                    bobot: "20%",
                    nilai: nilaiPerilaku.kerjasama_koordinasi,
                    nilaiSekarang: kerjasama_koordinasi
                },
                {
                    name: "Pemanfaatan Alat dan Media Kerja",
                    bobot: "10%",
                    nilaiSekarang: pemanfaatan_alat_dan_media_kerja,
                    nilai: nilaiPerilaku.pemanfaatan_alat_dan_media_kerja
                }
            ];

            const nilai = totalKinerja(
                result?.target_penilaian,
                result?.tugas_tambahan
            );

            const totalNilaiCapaianKinerja =
                nilai.totalKegiatanTambahan + nilai.totalPenilaianPekerjaan;

            const data = {
                id: result?.id,
                nama: result?.pegawai?.username,
                foto: base64,
                niptt: result?.pegawai?.employee_number,
                jabatan: result?.jabatan?.nama,
                skpd: result?.skpd?.detail,
                tahun: result?.tahun,
                pengalaman: result?.pengalaman_kerja,
                listPekerjaanTambahan: result?.pekerjaan_tambahan,
                listKegiatanTahunan: result?.target_penilaian,
                catatan_atasan_langsung: result?.catatan,
                penilai: {
                    nama: result?.atasan_langsung?.label[0],
                    nip: result?.atasan_langsung?.label[2],
                    golongan: result?.atasan_langsung?.label[5],
                    pangkat: result?.atasan_langsung?.label[7]
                },
                totalKegiatanBulanan: nilai?.totalPenilaianPekerjaan,
                totalNilaiCapaianKinerja,
                currentPerilaku,
                totalPerilaku: totalNilaiPerilaku
            };

            const dd = generateKinerjaTahunanFull(data);
            const doc = printer.createPdfKitDocument(dd);
            doc.end();
            res.setHeader("Content-type", "application/pdf");
            res.setHeader(
                "Content-disposition",
                'inline; filename="Example.pdf"'
            );
            doc.pipe(res);
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    cetakPenilaianBulananUser,
    cetakPenilaianAkhirUser
};
