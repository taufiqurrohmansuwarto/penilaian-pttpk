import axios from "axios";
const fetcher = axios.create({
  baseURL: "/pttpk-penilaian/api",
});

export const getRefSatuanKinerja = () => {
  return fetcher.get("/ref?show=satuan").then((res) => res?.data);
};
