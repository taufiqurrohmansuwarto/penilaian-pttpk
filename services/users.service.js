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

//  create penialain tahunana
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
