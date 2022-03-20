import axios from "axios";

const fetcher = axios.create({
  baseURL: "/pttpk-penilaian/api",
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
export const getPenilaianBulanan = () => {};
export const updatePenilaianBulanan = () => {};
export const hapusPenilaianBulanan = () => {};
export const createPenilaianBulanan = () => {};

// target tahunan
export const getTargetTahunan = () => {};
export const updateTargeTahunan = () => {};
export const hapusTargetTahunan = () => {};
export const createTargetTahunan = () => {};
