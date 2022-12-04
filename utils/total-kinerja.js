import { round, sum, sumBy } from "lodash";

const PENGALI_NILAI_INTEGRITAS = 0.25;
const PENGALI_KEDISIPLINAN = 0.25;
const PENGALI_ORIENTASI_PELAYANAN = 0.2;
const PENGALI_KERJASAMA_DAN_KOORDINASI = 0.2;
const PENGALI_PEMANFAATAN_ALAT_DAN_MEDIA_KERJA = 0.1;

module.exports.totalNilaiPerilaku = ({
    integritas,
    kedisiplinan,
    orientasiPelayanan,
    kerjasama,
    pemanfaatanAlat
}) => {
    const total =
        integritas * PENGALI_NILAI_INTEGRITAS +
        kedisiplinan * PENGALI_KEDISIPLINAN +
        orientasiPelayanan * PENGALI_ORIENTASI_PELAYANAN +
        kerjasama * PENGALI_KERJASAMA_DAN_KOORDINASI +
        pemanfaatanAlat * PENGALI_PEMANFAATAN_ALAT_DAN_MEDIA_KERJA;

    return total;
};
const totalPekerjaanTambahanFn = function (listPekerjaanTambahan) {
    if (listPekerjaanTambahan.length === 0) {
        return 0;
    } else {
        // ganjil
        if (listPekerjaanTambahan.length % 2 !== 0) {
            return (listPekerjaanTambahan.length + 1) / 2;
        } else {
            return listPekerjaanTambahan.length / 2;
        }
    }
};

export const totalKinerja = (kegiatanTahunan, kegiatanTambahan) => {
    let total;
    if (!kegiatanTahunan.length) {
        total = 0;
    } else {
        const result = kegiatanTahunan?.map((kegiatan) => {
            const target = kegiatan?.kuantitas;
            const capaian = sumBy(kegiatan?.kinerja_bulanan, "kuantitas");

            const hasil = round((capaian / target) * 100, 2);

            // kalau dia lebih 100 cetak 100
            const realityValue = hasil > 100 ? 100 : hasil;
            return realityValue;
        });

        console.log({ result, kegiatanTahunan });
        total = sum(result) / result.length;
    }

    const totalKegiatanTambahan = totalPekerjaanTambahanFn(kegiatanTambahan);

    const hasil = {
        totalKegiatanTambahan: round(totalKegiatanTambahan, 2),
        totalPenilaianPekerjaan: round(total, 2)
    };

    return hasil;
};
