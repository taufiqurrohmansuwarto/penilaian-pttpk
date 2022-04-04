import axios from "axios";

const fetcher = axios.create({
    baseURL: "/pttpk-penilaian/api/approval"
});

export const getPenilaian = ({ bulan, tahun }) => {
    return fetcher
        .get(`/penilaian?bulan=${bulan}&tahun=${tahun}`)
        .then((res) => res?.data);
};
