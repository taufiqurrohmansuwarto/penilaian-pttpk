import axios from "axios";

const fetcher = axios.create({
    baseURL: "/pttpk-penilaian/api/fasilitator"
});

export const downloadPenilaianBulanan = ({ tahun, bulan }) => {
    return fetcher
        .get(`/penilaian-bulanan?tahun=${tahun}&bulan=${bulan}`, {
            responseType: "blob"
        })
        .then((res) => res?.data);
};

export const downloadPenilaianAkhir = ({ tahun }) => {
    return fetcher
        .get(`/penilaian-tahunan?tahun=${tahun}`, { responseType: "blob" })
        .then((res) => res?.data);
};
