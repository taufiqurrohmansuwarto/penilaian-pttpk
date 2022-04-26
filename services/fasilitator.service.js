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

export const getSatuanKinerja = () => {
    return fetcher.get(`/satuan-kinerja`).then((res) => res?.data);
};

export const createSatuanKinerja = (data) => {
    return fetcher.post(`/satuan-kinerja`, data).then((res) => res?.data);
};

export const updateSatuanKinerja = ({ id, data }) => {
    return fetcher
        .patch(`/satuan-kinerja/${id}`, data)
        .then((res) => res?.data);
};
