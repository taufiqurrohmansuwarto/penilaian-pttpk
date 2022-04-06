import axios from "axios";

const fetcher = axios.create({
    baseURL: "/pttpk-penilaian/api/approval"
});

export const getPenilaianApproval = ({ bulan, tahun }) => {
    return fetcher
        .get(`/penilaian?bulan=${bulan}&tahun=${tahun}`)
        .then((res) => res?.data);
};

export const getPenilaianBulananApproval = ({ id, bulan, tahun }) => {
    return fetcher
        .get(`/penilaian/${id}?bulan=${bulan}&tahun=${tahun}`)
        .then((res) => res?.data);
};

export const approvaPenilaianBulananApproval = ({ id, data, bulan, tahun }) => {
    return fetcher
        .put(`/penilaian/${id}?bulan=${bulan}&tahun=${tahun}`, data)
        .then((res) => res?.data);
};
