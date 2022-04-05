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
    console.log(id, bulan, tahun);
    return fetcher
        .get(`/penilaian/${id}?bulan=${bulan}&tahun=${tahun}`)
        .then((res) => res?.data);
};
