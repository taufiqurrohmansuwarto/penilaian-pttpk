import axios from "axios";

const fetcher = axios.create({
    baseURL: "/pttpk-penilaian/api"
});

// tambahan
export const getJabatan = () => {
    return fetcher.get("/user/jabatan").then((res) => res?.data);
};

export const getUnor = () => {
    return fetcher.get("/user/unor").then((res) => res?.data);
};

//  penilaian
export const getPenilaian = () => {
    return fetcher.get("/user/penilaian").then((res) => res?.data);
};

export const getPenilaianAktif = () => {
    return fetcher.get("/user/penilaian?aktif=true").then((res) => res?.data);
};

// todo get this shit out
export const updatePenilaian = () => {};

export const hapusPenilaian = (id) => {
    return fetcher.delete(`/user/penilaian/${id}`).then((res) => res?.data);
};

export const buatPenilaian = (data) => {
    return fetcher.post("/user/penilaian", data).then((res) => res?.data);
};

export const aktifPenilaian = (id) => {
    return fetcher.put(`/user/penilaian/${id}`).then((res) => res?.data);
};

export const detailPenilaian = (id) => {
    return fetcher.get(`/user/penilaian/${id}`).then((res) => res?.data);
};

// target penilaian
export const getTargetPenilaian = (id) =>
    fetcher.get(`/user/penilaian/${id}/target`).then((res) => res?.data);

export const createTargetPenilaian = ({ data, id }) =>
    fetcher.post(`/user/penilaian/${id}/target`, data).then((res) => res?.data);

export const updateTargetPenilaian = ({ data, id, targetId }) =>
    fetcher
        .patch(`/user/penilaian/${id}/target/${targetId}`, data)
        .then((res) => res?.data);

export const detailTargetPenilaian = ({ id, targetId }) =>
    fetcher
        .get(`/user/penilaian/${id}/target/${targetId}`)
        .then((res) => res?.data);

export const removeTargetPenilaian = ({ id, targetId }) =>
    fetcher
        .delete(`/user/penilaian/${id}/target/${targetId}`)
        .then((res) => res?.data);

// crate penilaain bulanan
export const getPenilaianBulanan = (bulan, tahun) => {
    return fetcher
        .get(`/user/penilaian/bulanan?bulan=${bulan}&tahun=${tahun}`)
        .then((res) => res?.data);
};

export const createPenilaianBulanan = (data) => {
    return fetcher
        .post("/user/penilaian/bulanan", data)
        .then((res) => res?.data);
};

export const updatePenilaianBulanan = ({ id, data }) => {
    return fetcher
        .patch(`/user/penilaian/bulanan/${id}`, data)
        .then((res) => res?.data);
};

export const hapusPenilaianBulanan = (id) => {
    return fetcher
        .delete(`/user/penilaian/bulanan/${id}`)
        .then((res) => res?.data);
};

export const cariPegawaiPNS = (nip) => {
    return fetcher.get(`/user/pns?nip=${nip}`).then((res) => res?.data);
};

// target tahunan
export const getTargetTahunan = () => {};
export const updateTargeTahunan = () => {};
export const hapusTargetTahunan = () => {};
export const createTargetTahunan = () => {};

// kirim atasan
export const kirimAtasan = ({ bulan, tahun }) => {
    return fetcher.put(`/user/request-penilaian?bulan=${bulan}&tahun=${tahun}`);
};

export const batalKirimAtasan = (data) => {
    return fetcher.delete(`/user/request-penilaian`);
};

export const getRequestPenilaian = (bulan, tahun) => {
    return fetcher
        .get(`/user/acc-kinerja-bulanan?bulan=${bulan}&tahun=${tahun}`)
        .then((res) => res?.data);
};
