import axios from "axios";

const fetcher = axios.create({
    baseURL: "/pttpk-penilaian/api"
});

export const getAnnouncements = () => {
    return fetcher.get(`/announcements`).then((res) => res?.data);
};

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
export const updatePenilaian = ({ id, data }) => {
    return fetcher
        .patch(`/user/penilaian/${id}`, data)
        .then((res) => res?.data);
};

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

export const getPenilaianBulananById = (id) => {
    return fetcher
        .get(`/user/penilaian/bulanan/${id}`)
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

export const batalKirimAtasan = ({ bulan, tahun }) => {
    return fetcher.delete(
        `/user/request-penilaian?bulan=${bulan}&tahun=${tahun}`
    );
};

export const getRequestPenilaian = (bulan, tahun) => {
    return fetcher
        .get(`/user/acc-kinerja-bulanan?bulan=${bulan}&tahun=${tahun}`)
        .then((res) => res?.data);
};

// cetak penilaian bulanan dan penilaian akhir
export const cetakPenilaianBulanan = ({ bulan, tahun, data }) => {
    return fetcher
        .post(
            `/user/cetak-penilaian-bulanan?bulan=${bulan}&tahun=${tahun}`,
            data,
            {
                responseType: "blob"
            }
        )
        .then((res) => res?.data);
};

export const cetakPenilaianAkhir = (data) => {
    return fetcher
        .post(`/user/cetak-penilaian-akhir`, data, { responseType: "blob" })
        .then((res) => res?.data);
};

// tugas tambahan motherfucker
export const getTugasTambahan = (penilaianId) => {
    return fetcher
        .get(`/user/penilaian/${penilaianId}/tambahan`)
        .then((res) => res?.data);
};

export const getDetailTugasTambahan = (penilaianId, id) => {
    return fetcher
        .get(`/user/penilaian/${penilaianId}/tambahan/${id}`)
        .then((res) => res?.data);
};

export const createTugasTambahan = ({ id, data }) => {
    return fetcher
        .post(`/user/penilaian/${id}/tambahan`, data)
        .then((res) => res?.data);
};

export const updateTugasTambahan = ({ penilaianId, data, id }) => {
    return fetcher
        .patch(`/user/penilaian/${penilaianId}/tambahan/${id}`, data)
        .then((res) => res?.data);
};

export const removeTugasTambahan = ({ penilaianId, id }) => {
    return fetcher
        .delete(`/user/penilaian/${penilaianId}/tambahan/${id}`)
        .then((res) => res?.data);
};

export const kirimAtasanPenilaianAkhir = () => {
    return fetcher
        .put(`/user/request-penilaian-akhir`)
        .then((res) => res?.data);
};

export const batalKirimAtasanPenilaianAkhir = () => {
    return fetcher
        .delete(`/user/request-penilaian-akhir`)
        .then((res) => res?.data);
};

export const kirimAtasanCuti = ({ bulan, tahun }) => {
    return fetcher
        .put(`/user/request-penilaian-cuti?bulan=${bulan}&tahun=${tahun}`)
        .then((res) => res?.data);
};

export const batalKirimAtasanCuti = ({ bulan, tahun }) => {
    return fetcher
        .delete(`/user/request-penilaian-cuti?bulan=${bulan}&tahun=${tahun}`)
        .then((res) => res?.data);
};
