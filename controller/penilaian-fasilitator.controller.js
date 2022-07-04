import { meanBy } from "lodash";
import moment from "moment";
import prisma from "../lib/prisma";
const excel = require("exceljs");

BigInt.prototype.toJSON = function () {
    return this.toString();
};

const arrayToObject = (array, keyField) =>
    array.reduce((obj, item) => {
        obj[item[keyField]] = item;
        return obj;
    }, {});

const listPenilianBulanan = async (req, res) => {
    try {
        const { fetcher } = req;

        const queryBulan = req?.query?.bulan || moment(new Date()).format("M");
        const queryTahun =
            req?.query?.tahun || moment(new Date()).format("YYYY");

        const tahun = parseInt(queryTahun);
        const bulan = parseInt(queryBulan);

        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet(`${tahun}-${bulan}`);

        const result = await prisma.acc_kinerja_bulanan.findMany({
            where: {
                bulan,
                tahun,
                penilaian: {
                    aktif: true
                }
            },
            include: {
                penilaian: {
                    include: {
                        kinerja_bulanan: {
                            where: {
                                tahun,
                                bulan
                            }
                        }
                    }
                }
            }
        });

        const currentPembanding = result?.map((r) => {
            const currentUserId = r?.pegawai_id?.split("|");
            const id = currentUserId[1];

            return {
                id,
                sudah_verif: r?.sudah_verif,
                penilai: r?.atasan_langsung?.label[0],
                nip: r?.penilaian?.atasan_langsung?.label[2],
                is_cuti: r?.is_cuti,
                rerata_kinerja: meanBy(
                    r?.penilaian?.kinerja_bulanan,
                    "kualitas"
                )
            };
        });

        const hasil = await fetcher.get("/pttpk-fasilitator/employees");
        const userData = hasil?.data?.data;

        const groupingPenilaian = arrayToObject(currentPembanding, "id");

        const currentResult = await userData?.map((d) => {
            return {
                ...d,
                sudah_verif: groupingPenilaian[d?.id_ptt]?.sudah_verif || false,
                rerata_kinerja:
                    groupingPenilaian[d?.id_ptt]?.rerata_kinerja || 0,
                penilai: groupingPenilaian[d?.id_ptt]?.penilai || "",
                lagi_cuti: groupingPenilaian[d?.id_ptt]?.is_cuti
                    ? "IYA CUTI"
                    : "NGGAK"
            };
        });

        worksheet.columns = [
            { header: "NIPTT", key: "niptt" },
            { header: "Nama", key: "nama" },
            { header: "Perangkat Daerah", key: "perangkat_daerah" },
            { header: "Sudah Verif", key: "sudah_verif" },
            { header: "Penilai", key: "penilai" },
            { header: "Cuti", key: "lagi_cuti" },
            { header: "Rerata Kinerja", key: "rerata_kinerja" }
        ];

        // now its time to shine motherfucker
        worksheet.addRows(currentResult);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "result.xlsx"
        );

        await workbook.xlsx.write(res);
        res.status(200).end();
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

const listPenilaianTahunan = async (req, res) => {
    try {
        const { fetcher } = req;

        const queryTahun =
            req?.query?.tahun || moment(new Date()).format("YYYY");

        const tahun = parseInt(queryTahun);

        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet(`${tahun}`);

        // ini hanya yang aktif saja
        const result = await prisma.penilaian.findMany({
            where: {
                tahun,
                aktif: true,
                status: "diverif"
            },
            include: {
                pegawai: true
            }
        });

        const currentPembanding = result?.map((r) => {
            const currentUserId = r?.pegawai?.custom_id?.split("|");
            const id = currentUserId[1];

            return {
                id,
                status: r?.status || "belum dikerjakan / belum diaktifkan",
                penilai: r?.atasan_langsung?.label[0] || "belum dikerjakan",
                nip: r?.atasan_langsung?.label[2]
            };
        });

        const hasil = await fetcher.get("/pttpk-fasilitator/employees");
        const userData = hasil?.data?.data;

        const groupingPenilaian = arrayToObject(currentPembanding, "id");

        const currentResult = await userData?.map((d) => {
            return {
                ...d,
                status: groupingPenilaian[d?.id_ptt]?.status || false,
                penilai: groupingPenilaian[d?.id_ptt]?.penilai || ""
            };
        });

        worksheet.columns = [
            { header: "NIPTT", key: "niptt" },
            { header: "Nama", key: "nama" },
            { header: "Perangkat Daerah", key: "perangkat_daerah" },
            { header: "Status", key: "status" },
            { header: "Penilai", key: "penilai" }
        ];

        // now its time to shine motherfucker
        worksheet.addRows(currentResult);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "result.xlsx"
        );

        await workbook.xlsx.write(res);
        res.status(200).end();
    } catch (error) {
        console.log(error);
        res.status(400).json({ code: 400, message: "Internal Server Error" });
    }
};

module.exports = {
    listPenilianBulanan,
    listPenilaianTahunan
};
