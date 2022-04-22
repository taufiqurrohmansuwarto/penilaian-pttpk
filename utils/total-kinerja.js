import { sum, sumBy } from "lodash";

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

            return capaian / target;
        });
        total = sum(result);
    }
    const totalKegiatanTambahan = totalPekerjaanTambahanFn(kegiatanTambahan);

    return {
        totalKegiatanTambahan,
        totalPenilaianPekerjaan: total * 100 > 100 ? 100 : total * 100
    };
};
