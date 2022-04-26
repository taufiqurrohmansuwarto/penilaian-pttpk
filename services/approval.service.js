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

export const approvaPenilaianBulananApproval = ({
    id,
    data,
    bulan,
    tahun,
    id_ptt
}) => {
    return fetcher
        .put(
            `/penilaian/${id}?bulan=${bulan}&tahun=${tahun}&id_ptt=${id_ptt}`,
            data
        )
        .then((res) => res?.data);
};

export const getPenilaianAkhir = (tahun) => {
    return fetcher
        .get(`/penilaian/request-penilaian-akhir?tahun=${tahun}`)
        .then((res) => res?.data);
};

export const approvePenilaianAkhir = ({ tahun, id_ptt, data }) => {
    return fetcher
        .put(
            `/penilaian/request-penilaian-akhir?tahun=${tahun}&id_ptt=${id_ptt}`,
            data
        )
        .then((res) => res?.data);
};
